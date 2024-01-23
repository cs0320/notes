# CSCI 0320 notes mdbook

Adapted with thanks from the CSCI 1710 mdbook, set up by David Fryd.

## Instructions to Build

This is the source for the 0320 notes, which were formerly located on HackMD. It is built using mdbook.

See the user guide https://rust-lang.github.io/mdBook/guide/installation.html for more information.

1. Install Rust & Cargo from [this link](https://rust-lang.github.io/mdBook/guide/installation.html#:~:text=Rust%20installation%20page). You'll probably need to have at least Rust 1.75.0.
2. Run `cargo install mdbook`
3. Run `cargo install mdbook-admonish` 
4. Run `cargo install mdbook-katex`
5. `cd book` and `mdbook serve --open` to open the docs in a browser; mdbook will automatically rebuild the output _and_ automatically refresh your web browser when changes are made.

Check out the rest of the docs here: https://rust-lang.github.io/mdBook/guide/creating.html

## Directory Structure

The `book` subfolder contains the `mdbook` config and source. After building, the `book` sub-subfolder will contain the built notes HTML. The `.github` folder contains a workflow to automatically deploy the built HTML when new source is pushed to the `main` branch.