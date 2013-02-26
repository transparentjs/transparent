# Transparent
[http://github.com/transparentjs/transparent](http://github.com/transparentjs/transparent)

Transparent is library for creating removable proxies for JavaScript functions. Much
of it was extracted from the honorable [Sinon.js](http://sinonjs.org/), which has
used these constructs to make testing spies and stubs. The proxy acts exactly like the 
original method in all cases. The original method can be restored by calling
`object.method.restore()`. The returned proxy is the function object which replaced the 
original method. `proxy === object.method`.

Transparent can be used to build performance gathering proxies, logging proxies, or
even generalized middleware. In this way, libraries like Sinon and
[Nodetime](http://github.com/nodetime/nodetime) have the opportunity to build on
a common proxying structure rather than creating their own mutually incompatible
approaches.

Transparent subscribes to the philosophy of Component.js, and seeks to do nothing
else. If you cannot use it to replace your home grown proxying library.
