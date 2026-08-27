/**
 * The top of the friends table, arranged for the podium.
 *
 * The table is you plus the friends you have actually added, so it is one row
 * long on the day somebody installs the app and two rows long the first time
 * they add a friend. The arrangement used to be written out as
 * [second, first, third] straight from the table, which only holds once three
 * people are in it — below that the missing places came back undefined and the
 * podium threw on the first entry it read. The leaderboard crashed for exactly
 * the people it was meant to welcome: anyone who had just made a first friend.
 *
 * Three is the classic shape, winner raised between the other two. Two has no
 * middle to raise, so it stays in ranked order and reads left to right. One is
 * not a podium at all — standing alone on a winner's plinth is a joke at the
 * expense of someone who has nobody to rank against yet, and the table below
 * already says where they stand.
 */
export function arrangePodium<T>(rows: readonly T[]): T[] {
  const top = rows.slice(0, 3);
  if (top.length < 2) return [];
  if (top.length === 2) return top;
  return [top[1], top[0], top[2]];
}
