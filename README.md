# ばかのビンゴ • "Baka no Bingo" • Idiot Bingo
> Bingo for anime night.

## Planned for v3
- Real-time gameplay between players using [Web Sockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API).
- Add curses that allow players to create obstacles for other players
- Add challenges that can be completed at any time for bonus points or powerups (example: "Notice me, sempai": tell someone to "notice you". If they make eye contact, you succeed.)
- Add intermission challenges in which players perform tiles for points, based on votes from other players
- Use a tile's sold frequency and subtract the tile's replaced frequency to calculate how often it appears for more forgiving and active gameplay
- When a player has duplicates, mark them all simultaneously when that player selects any one of them

## Changelog
### Version 3
- Added 19 new tropes, generalized others
- Removed "shuffle" spell since players did not value it in version 2

### Version 2 – January 17, 2019
- Added variable scoring system based on the type of patterns sold (\[|\]\/_–‾+x#)
- Added "spells" to replace tiles, shuffle tiles, and reset all tiles – for a price
- Stored player data in localStorage to prevent issues
- Upgraded design and animations throughout
- Added several new tropes, generalized others
- Kept track of which tiles gott cleared most frequently via copy-pasteable data

## Ideas
- Different sets for specific genres. (avoid getting stuck with slice of life anime tropes during a action anime)
- Additional spells:
  - _*Duplicate:*_ Duplicate a favorable tile (-10pts)
  - _*Upgrade:*_ Generalize a too-specific tile (-10pts)
  - _*Challenge:*_ Make a tile more specific, but multiply the score gained (-5pts)
  - _*Curse:*_ Upgrade the difficulty of an opponent's tile and lock it (it cannot be cleared except through matching). (-20pts)