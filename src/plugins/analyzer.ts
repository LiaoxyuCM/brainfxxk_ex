/**
 * analyze codes to make sure these conform to syntax standards.
 */

export function bracket_check(code: string): boolean {
  /**
   * Check braket []
   *
   * @param code Code to analyze
   * @returns true if passed, false otherwise
   */

  let stacksize: number = 0;

  for (const chr of code) {
    switch (chr) {
      case "[":
        if (stacksize < Number.MAX_SAFE_INTEGER) {
          stacksize += 1;
        } else {
          return false;
        }
        break;
      case "]":
        if (stacksize > 0) {
          stacksize -= 1;
        } else {
          return false;
        }
    }
  }
  
  return !stacksize
}
