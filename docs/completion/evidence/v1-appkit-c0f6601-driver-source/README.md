# AppKit owned-session source gate

The packages job in [run 42890131895](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42890131895)
passed eight checks with zero failures or skips at actual checkout
`29044e62ed43e440f3771ff5bff03fcdb30a8e94`, from head
`c0f660128772f79f08f03d9025f011af94e2ab46`.

Four regressions use real local IPC sockets on the Ubuntu CI runner. They verify
that a response timeout keeps the native session connected until explicit
cleanup; late replies cannot revive it or permit another command; an
authentication timeout still leaves an owned cleanup handle; explicit close
settles a pending handshake; and initial connection failure also preserves
cleanup ownership. Four existing shared-archive contract checks passed in the
same invocation. The complete original job log retains the tests, checkout,
Node version and canonical core archive packing output.

This is the first actual socket execution for the client correction. Local
execution was blocked by the workspace's listener restriction; the rejected
local escalation was not bypassed and was not represented as a test pass.
The authorized existing CI source job runs these checks before its dependent
native job. The production default remains 35 seconds and no retry was added.

These checks establish the private client's ownership and protocol behavior.
They do not establish AppKit startup, foreground acquisition, native hover,
NSDraggingSession transfer or a passed native archive. Those require the
separate native job at the same checkout.
