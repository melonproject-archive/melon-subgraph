export function nameToSlug(name: string): string {
  let slug = "";
  for (let i = 0; i < name.length; i += 1) {
    let code = name.charCodeAt(i);

    if (code >= 48 && code <= 57) {
      // numbers
      slug += String.fromCharCode(code);
    } else if (code >= 97 && code <= 122) {
      // lower case characters
      slug += String.fromCharCode(code);
    } else if (code >= 65 && code <= 90) {
      // convert upper case characters to lower case
      slug += String.fromCharCode(code + 32);
    } else if (
      code == 32 ||
      code == 42 ||
      code == 45 ||
      code == 46 ||
      code == 60 ||
      code == 95
    ) {
      // space, period, *, underscore, dash to dash
      slug += "-";
    }
  }

  return slug;
}

// Registry: allowed characters
// !(char >= 0x30 && char <= 0x39) && // 9-0
// !(char >= 0x41 && char <= 0x5A) && // A-Z
// !(char >= 0x61 && char <= 0x7A) && // a-z
// !(char == 0x20 || char == 0x2D) && // space, dash
// !(char == 0x2E || char == 0x5F) && // period, underscore
// !(char == 0x2A) // *
