# Modules for tera-proxy

Modules for tera-proxy,
[Caali's][proxy-Caali] or [Pinkie's][proxy-Pinkie] fork,
with auto-update support.
All modules are working as of patch 75,
Apex 2.

I found most of them in a very old instance of proxy on my disk
and since they didn't seem to be listed anywhere anymore,
I updated them for current versions
and added a couple improvements where appropriate.
I do not know who the original authors were.


## Installation

1. Download a [zipball][] of this repository.
2. Unpack it and copy the desired modules into `<tera-proxy>/bin/node_modules`.


## Usage

To enter commands,
open chat,
type `/8` to select the proxy channel
and continue with your command,
e.g. `/8 lobby`.
Alternatively,
you can also type `!lobby`.

When a module doesn't list commands,
it will always be active as long as you installed it correctly.


---


## Instant Exit

Go to character selection without using the mouse.

| Command | Description |
|:-|:-|
| `exit` | Exit TERA. |

Your character will still linger on the server
for 10 seconds until the timeout.


## Lobby Command

Go to character selection without using the mouse.

| Command | Description |
|:-|:-|
| `lobby` | Initiate logout to character selection. |


## Party Death Markers

Spawns large visible markers on top of dead party members.

![Screenshot](./.media/pdm.jpg?raw=true)


| Command | Description |
|:-|:-|
| `pdm toggle` | Toggles the module off/on |
| `pdm clear`  | Removes all present markers |

There is also a `partydeathmarkers` alias.

### Known issues

* If you logout, any present markers will be removed.
* When someone dies, you have to be present for the markers to spawn.

### Info

* Tanks = red relic piece. <br>
  Healers = blue relic piece. <br>
  DPS = tall rare item beacon.
* No you cannot pickup the item.
  It's fake
  and spawned client-side just for the visual effect and only you can see it.
* Any item can be spawned,
  such as relic pieces which have different visual effects.
  See index.js for list.

### Changelog

- **2.0.0**
  * Complete rewrite for patch 74.


## timestamps

![preview](./.media/timestamps.png?raw=true)


<!-- REFERENCES -->

[proxy-Caali]: https://github.com/caali-hackerman/tera-proxy/
[proxy-Pinkie]: https://discord.gg/RR9zf85
[zipball]: https://github.com/FichteFoll/tera-proxy-modules/archive/master.zip
