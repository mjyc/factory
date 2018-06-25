# Meteor Loglevel

Meteor package for [pimterry\'s loglevel](https://github.com/pimterry/loglevel).

It is a minimal wrapper around loglevel.

## Example

Configure your Meteor settings file, e.g.

```
  ...

  "public": {
    "loglevel": {  // client logging
      "default": "debug"
    }
  },

  ...

  "loglevel": {  // server logging
    "default": "debug",
    "levels": {
      "fixtures": "info"
    }
  }

  ...
```

and then use it! in your `server_file.js`:

```
import log from 'meteor/mjyc:loglevel';

logger = log.getLogger('my_meteor_methods');

...

logger.debug(`method was called with args! ${args}`);
```

and in your `client_file.jsx`:

```
import log from 'meteor/mjyc:loglevel';

logger = log.getLogger('MyReactComponent');

...

logger.warn(`MyReactComponent did not received props?! ${props}`);
```
