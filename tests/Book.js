/**
 * Represents a book in a library system.
 */
class Book {
  /**
   * Create a new Book instance.
   * @param {string} title - The title of the book.
   * @param {string} author - The author of the book.
   * @param {number} year - The publication year of the book.
   * @param {string} [isbn] - The ISBN of the book (optional).
   */
  constructor(title, author, year, isbn) {
    this.title = title;
    this.author = author;
    this.year = year;
    this.isbn = isbn;
  }

  /**
   * Get the full details of the book.
   * @returns {string} A string containing all the book's details.
   */
  getDetails() {
    return `${this.title} by ${this.author} (${this.year})${this.isbn ? ` ISBN: ${this.isbn}` : ''}`;
  }

  /**
   * Check if the book is considered a classic.
   * A book is considered a classic if it's more than 50 years old.
   * @returns {boolean} True if the book is a classic, false otherwise.
   */
  isClassic() {
    const currentYear = new Date().getFullYear();
    return currentYear - this.year > 50;
  }

  /**
   * Update the book's information.
   * @param {Object} updates - An object containing the fields to update.
   * @param {string} [updates.title] - The new title of the book.
   * @param {string} [updates.author] - The new author of the book.
   * @param {number} [updates.year] - The new publication year of the book.
   * @param {string} [updates.isbn] - The new ISBN of the book.
   */
  updateInfo(updates) {
    if (updates.title) this.title = updates.title;
    if (updates.author) this.author = updates.author;
    if (updates.year) this.year = updates.year;
    if (updates.isbn) this.isbn = updates.isbn;
  }
}

// Example usage
const myBook = new Book("The Great Gatsby", "F. Scott Fitzgerald", 1925, "9780743273565");
console.log(myBook.getDetails());
console.log(`Is it a classic? ${myBook.isClassic()}`);

myBook.updateInfo({ year: 2020 });
console.log(myBook.getDetails());
console.log(`Is it a classic? ${myBook.isClassic()}`);
