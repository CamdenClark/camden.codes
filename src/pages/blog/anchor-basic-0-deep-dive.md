---
templateKey: "blog-post"
title: "A deep dive into the basic-0 anchor example"
date: 2021-10-24T00:00:00.000Z
description: "Anchor docs are pretty primitive, maybe this will help?"
tags:
  - solana
  - crypto
  - anchor
---

# Prerequisites

I assume a working knowledge of Rust, git, and js here. You should have installed the [prerequisites](https://project-serum.github.io/anchor/getting-started/installation.html). I'm basically re-writing the tutorial found [here](https://project-serum.github.io/anchor/tutorials/tutorial-0.html), so feel free to reference that as well.

# Checking out code

First, clone the Anchor repo.

```
git clone https://github.com/project-serum/anchor
```

Next, checkout the tagged branch of the same version of the anchor cli you have installed.

```
git checkout tags/<version>
```

And change directories to the [example](https://github.com/project-serum/anchor/tree/master/examples/tutorial/basic-0)

```
cd anchor/examples/tutorial/basic-0
```

# The main pieces

There are three components of this tutorial repo:

1. The Solana program itself. This is found at `./programs/basic-0/src/lib.rs`.
2. The Anchor framework integration tests, which are found at `./tests/basic-0.js`. Anchor introduces some utilities for fast iterative integration testing of your program.
3. The client, which is at `./client.js`. This is a stand-in for what would be your frontend in an actual dApp.

# Diving into the program

Open `./program/basic-0/src/lib.rs` and you'll see the following:

```rust
use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
mod basic_0 {
    use super::*;
    pub fn initialize(_ctx: Context<Initialize>) -> ProgramResult {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
```

Let's step through each piece of this.

```rust
use anchor_lang::prelude::*;
```

Similar to Rust itself, anchor has a prelude. This imports all the pieces of the anchor framework that we'll need to define our program.

```rust
declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");
```

`declare_id!` declares what the program's account id is, and allows for a consistent program id everywhere we deploy this (locally, devnet, testnet, mainnet-beta).
Note that if we actually deploy this, anchor would instead pick a different account id, because we will have to generate a new keypair.

(side-note: This is a piece of anchor I'm still trying to wrap my head around. There's more discussion about a more ergonomic way of doing this [here](https://github.com/project-serum/anchor/issues/695)).

```rust
#[program]
mod basic_0 {
    use super::*;
    pub fn initialize(_ctx: Context<Initialize>) -> ProgramResult {
        Ok(())
    }
}
```

A lot going on here. First, we define a [Rust module](https://doc.rust-lang.org/book/ch07-00-managing-growing-projects-with-packages-crates-and-modules.html) called basic_0.
Since this module has the [program attribute](https://github.com/project-serum/anchor/blob/master/lang/attribute/program/src/lib.rs), anchor will know that this module contains all the program instruction handlers.

In your editor, try deleting `use super::*;` and run `anchor build`. This will fail to compile!
This is because `use super::*;` brings all the things we imported in from the anchor prelude into the current module's context.

Finally, we get to the initialize handler, which is the only instruction that we've defined as part of this Anchor program.
Our initialize handler takes in one parameter, `_ctx` which has type `Context<Initialize>`. This is a really
stripped down example, so we won't perform any business logic inside this instruction handler. In a non-trivial
instruction handler, this parameter would hold our account data, which we would be able to
manipulate. Here, we just return `Ok(())`, which returns a successful result back to the client.

```rust
#[derive(Accounts)]
pub struct Initialize {}
```

Finally, we have the last piece of the program, which describes the Initialize struct. In a non-trivial program,
this would define _all_ (and I mean _all_) the accounts that are manipulated by the instruction handler. Since
we aren't actually using any accounts in this example, we don't need to add anything. However, we still need
to define a struct that holds all the accounts and signal to the instruction handler what we should expect
from the client.

# Building and Emitting an IDL

Alright, we can now use the anchor CLI to build our program, and emit an IDL. You can think of the IDL as the
specification of your program for clients. Let's run `anchor build`, then open `target/idl/basic_0.json`.

You'll see the following:

```json
{
  "version": "0.0.0",
  "name": "basic",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [],
      "args": []
    }
  ]
}
```

The most important thing listed here is the set of instructions. Anchor has used the program definition we
created above to generate this IDL. We have one instruction, with name `initialize` (the same as our
instruction handler). It has no accounts, as we specified in the `Initialize` struct, and no `args`,
which we have because the `initialize` instruction handler only takes in one argument (`_ctx`).

This file is the key bridge between your anchor program and consuming it in the client and integration tests.
It is how anchor's frontend utilities know how to call your program.

# Deploying and Testing with a Client

Now that we've built our program, we can now deploy it locally.

## Deploying locally

If you haven't used solana before, you should generate a wallet first.

```
solana-keygen new
```

Then run

```
solana-test-validator
```

This test validator will allow us to test a local deploy of our program. Let's do that now.

```
anchor deploy
```

You should see the following output:

```
Deploying workspace: http://127.0.0.1:8899
Upgrade authority: ...
Deploying program "basic-0"...
Program path: ...
Program Id: someId.....
```

Copy the Program Id. That is the address of your program on your local network!

## The client

Open `./client.js` in your editor. You'll see the following:

```js
// ... snip

// Read the generated IDL.
const idl = JSON.parse(
  require("fs").readFileSync("./target/idl/basic_0.json", "utf8")
);

// Address of the deployed program.
const programId = new anchor.web3.PublicKey("<YOUR-PROGRAM-ID>");

// Generate the program client from IDL.
const program = new anchor.Program(idl, programId);

// Execute the RPC.
await program.rpc.initialize();

// ... snip
```

Let's break this down. First we have the IDL we generated before, which we read in from JSON.
Then, we define the program's id, which you should have copied above. We define the program
using anchor's tooling, which takes in the idl and program id, and defines (at runtime) the
interface to the program. Finally, we execute the initialize instruction locally!

Now, let's actually run the client. We'll need to get the path to your wallet's keypair, so run

```
solana config get keypair
```

then

```
ANCHOR_WALLET=<YOUR-KEYPAIR-PATH> node client.js
```

You've now created a client and executed a transaction!

**Make sure you shut down the solana-test-validator for this next part!**

# Testing using the integration testing framework

This workflow we have with the client isn't practical for local development on our programs.
It's just not ergonomic, we'll have to copy and paste a bunch of things every time we want to
make changes. Even more problematic is that as we develop more complicated applications, it
will get more and more difficult to maintain the scaffold of state needed to test complicated
scenarios.

Anchor has a solution for this: `anchor test`. Let's take a look at `./tests/basic-0.js`

```js
const anchor = require("@project-serum/anchor");

describe("basic-0", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.local());

  it("Uses the workspace to invoke the initialize instruction", async () => {
    // #region code
    // Read the deployed program from the workspace.
    const program = anchor.workspace.Basic0;

    // Execute the RPC.
    await program.rpc.initialize();
    // #endregion code
  });
});
```

First, we import anchor. Then, we define a test block. We set up anchor to use the local
provider.

#### SHARP EDGE ALERT

`anchor.workspace.Basic0` is loaded into the test environment for us. I'm really not sure
exactly how the workspace feature works yet, but changing the program can generate a different
idl that wouldn't be represented here. Just be careful when making changes to the name of
your program module and make sure the tests represent that.

Anyways, this does all the work for us we did in the client previously. So, now we can just
do the exact same call we did in the client, `await program.rpc.initialize();`

The test framework here gives you more flexibility to specify different account ids programmatically,
and make sure that you're always starting with fresh state on each test run.

Thanks for reading all, it's been fun to learn anchor and rust over the past couple months. The
docs were a big inhibitor for me so I'd like to do more of these deep dives to illuminate the way
for anchor.
