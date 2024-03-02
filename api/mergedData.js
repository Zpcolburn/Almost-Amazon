// for merged promises
import { getSingleBook, deleteBook } from './bookData';
import { getSingleAuthor, getAuthorBooks, deleteSingleAuthor } from './authorData';

// TODO: Get data for viewBook
const getBookDetails = async (firebaseKey) => { // the async keyword let's JS know this is asynchronous function (promise)
  const bookObject = await getSingleBook(firebaseKey); // await stops the code in this function and waits for the response. This is like using .then
  const authorObject = await getSingleAuthor(bookObject.author_id); // this function uses the data response from the bookObject

  return { ...bookObject, authorObject };
};

const deleteAuthorBooksRelationship = (firebaseKey) => new Promise((resolve, reject) => {
  getAuthorBooks(firebaseKey).then((authorBooksArray) => {
    const deleteBookPromises = authorBooksArray.map((book) => deleteBook(book.firebaseKey));

    Promise.all(deleteBookPromises).then(() => {
      deleteSingleAuthor(firebaseKey).then(resolve);
    });
  }).catch(reject);
});

const getAuthorDetails = async (firebaseKey) => {
  const authorObject = await getSingleAuthor(firebaseKey);
  const authorBooks = await getAuthorBooks(firebaseKey);
  return { ...authorObject, books: authorBooks };
};

export {
  getBookDetails, getAuthorDetails, deleteAuthorBooksRelationship,
};
