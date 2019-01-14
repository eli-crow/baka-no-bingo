# バカのビンゴ • "Baka no Bingo" • Idiot Bingo
> Bingo for anime night.

## Planned for v2
- Ensure players' scores don't disappear in the middle of a game, possibly using localStorage.
- Remove the "Pick a Board" feature and replace with system of manually clearing undesired cells.
- Replace scoring by board with scoring system for cleared bingos.
- - Bingoed cells are removed from board.
- - Bingoes that use the free tile are worth 20 points
- - Bingoes that don't use the free tile are worth 50 points
- Spend points to manually clear a cell from the board.
- - Spend 10 points to clear a cell.
- - Spend 50 points to clear the whole board.
- Feedback for scoring

## Backlog
- Different sets for specific genres. (avoid getting stuck with slice of life anime tropes during a action anime)
- Keep track of which cells get cleared most frequently and make copy-pasteable
- Use frequency data to assign score
- Bonus points for certain conditions on cells
- Pull tropes from google sheets or airtable

## Ideas
- Create a session between players. Have other players ratify the bingo. Identify a means of incentivizing players to ratify honestly.
- Additional spells:
- - _*Duplicate:*_ Duplicate a favorable cell (-10pts)
- - _*Upgrade:*_ Generalize a too-specific tile (-10pts)
- - _*Challenge:*_ Make a cell more specific, but multiply the score gained (-5pts)
- - _*Curse:*_ Upgrade the difficulty of an opponent's cell and lock it (it cannot be cleared except through matching). (-20pts)