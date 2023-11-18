/** 4 Alphanumeric characters */
export const ROOM_CODE_PATTERN = '^[a-zA-Z0-9]{4}$';

/** Alphanumeric characters, except characters that could be confused for one another */
const ROOM_CODE_CHARACTERS = 'abcdefghjkmnpqrstuvwxyz123456789';

/** Literal "four-letter words" adapted from https://www.cs.cmu.edu/~biglou/resources/bad-words.txt */
const ROOM_CODE_BANNED_WORDS = [ 'abbo', 'alla', 'anal', 'anus', 'arab', 'arse', 'babe', 'barf', 'bast', 'blow', 'bomb', 'bomd', 'bong', 'boob', 'boom', 'burn', 'butt', 'chav', 'chin', 'cigs', 'clit', 'cock', 'coon', 'crap', 'cumm', 'cunn', 'cunt', 'dago', 'damn', 'dead', 'dego', 'deth', 'dick', 'died', 'dies', 'dike', 'dink', 'dive', 'dong', 'doom', 'dope', 'drug', 'dumb', 'dyke', 'fart', 'fear', 'fire', 'floo', 'fore', 'fuck', 'fuks', 'geez', 'geni', 'gipp', 'gook', 'groe', 'gypo', 'gypp', 'hapa', 'hebe', 'heeb', 'hell', 'hobo', 'hoes', 'hole', 'homo', 'honk', 'hook', 'hore', 'hork', 'horn', 'ikey', 'itch', 'jade', 'jeez', 'jiga', 'jigg', 'jism', 'jiz ', 'jizz', 'jugs', 'kike', 'kill', 'kink', 'kock', 'koon', 'krap', 'kums', 'kunt', 'kyke', 'laid', 'lezz', 'lies', 'limy', 'mams', 'meth', 'milf', 'mofo', 'moky', 'muff', 'munt', 'nazi', 'nigg', 'nigr', 'nook', 'nude', 'nuke', 'oral', 'orga', 'orgy', 'paki', 'payo', 'peck', 'perv', 'phuk', 'phuq', 'pi55', 'piky', 'pimp', 'piss', 'pixy', 'pohm', 'poon', 'poop', 'porn', 'pric', 'pros', 'pube', 'pudd', 'puke', 'puss', 'pusy', 'quim', 'ra8s', 'rape', 'rere', 'scag', 'scat', 'scum', 'shag', 'shat', 'shav', 'shit', 'sick', 'skum', 'slav', 'slut', 'smut', 'snot', 'spic', 'spig', 'spik', 'spit', 'suck', 'taff', 'tang', 'tard', 'teat', 'tits', 'turd', 'twat', 'vibr', 'wank', 'wetb', 'whit', 'whiz', 'whop', 'wuss']; // prettier-ignore

/** Generate a rndom four-character code without ambiguous characters or bad words */
export function generateGameCode() {
  while (true) {
    let candidateId = '';
    for (let i = 0; i < 4; i++) {
      const index = Math.floor(Math.random() * ROOM_CODE_CHARACTERS.length);
      const character = ROOM_CODE_CHARACTERS.charAt(index);
      candidateId += character;
    }

    if (ROOM_CODE_BANNED_WORDS.includes(candidateId)) {
      continue;
    }

    return candidateId;
  }
}
