const localStorageKey = "BOOK_DATA";

const title = document.querySelector("#inputBookTitle");
const author = document.querySelector("#inputBookAuthor");
const year = document.querySelector("#inputBookYear");

const isRead = document.querySelector("#inputBookIsComplete");

const btnSubmit = document.querySelector("#bookSubmit");
const searchValue = document.querySelector("#searchBookTitle");
const btnSearch = document.querySelector("#searchSubmit");

function getData() {
  return JSON.parse(localStorage.getItem(localStorageKey)) || [];
}

function insertData(books) {
  alert(`Buku Baru Berhasil Ditambahkan ke Rak`);

  let book = books;
  let bookData = [];

  if (localStorage.getItem(localStorageKey) === null) {
    bookData = [];
  } else {
    bookData = JSON.parse(localStorage.getItem(localStorageKey));
  }
  bookData.push(book);

  localStorage.setItem(localStorageKey, JSON.stringify(bookData));

  renderData(getData());
}

function renderData(books = []) {
  const inCompleted = document.querySelector("#incompleteBookshelfList");
  const completed = document.querySelector("#completeBookshelfList");

  inCompleted.innerHTML = "";
  completed.innerHTML = "";

  books.forEach((book) => {
    if (book.isCompleted == false) {
      let el = `
            <article class="book_item">
  
            <div class="book-information">
                <h3 style="text-align:justify;">${book.title}</h3>
                <p style="text-align:justify;">Penulis: ${book.author}</p>
                <p>Tahun: ${book.year}</p>
            </div>
                <div class="bookID">
                    <button class="bg-success text-white" onclick="readedBook('${book.id}')">
                        <span>Selesai dibaca</span>
                    </button>
                    <button class="bg-danger text-white" onclick="removeBook('${book.id}')">
                        <span>Hapus buku</span>
                    </button>
                </div>
            </article>
            `;

      inCompleted.innerHTML += el;
    } else {
      let el = `
            <article class="book_item">
              
              <div class="book-information">
                <h3 style="text-align:justify;">${book.title}</h3>
                <p style="text-align:justify;">Penulis: ${book.author}</p>
                <p>Tahun: ${book.year}</p>
              </div>
  
                <div class="bookID" >
                  <button class="bg-success text-white" onclick="unreadedBook('${book.id}')">  
                    <span>Belum selesai dibaca</span>
                  </button>
                  <button class="bg-danger text-white" onclick="removeBook('${book.id}')">            
                    <span>Hapus buku</span>
                  </button>
                </div>
            </article>
            `;
      completed.innerHTML += el;
    }
  });
  getBooksInformation();
}

function removeBook(id) {
  let cfm = confirm("Yakin menghapus buku ini ?");

  if (cfm == true) {
    const bookDataDetail = getData().filter((a) => a.id == id);
    const bookData = getData().filter((a) => a.id != id);
    localStorage.setItem(localStorageKey, JSON.stringify(bookData));
    renderData(getData());
    alert(`[Buku ${bookDataDetail[0].title}] telah dihapus dari rak`);
  } else {
    return 0;
  }
  getBooksInformation();
}

function readedBook(id) {
  let cfm = confirm("Sudah selesaikah anda membaca buku ini?");

  if (cfm == true) {
    const bookDataDetail = getData().filter((a) => a.id == id);
    const newBook = {
      id: bookDataDetail[0].id,
      title: bookDataDetail[0].title,
      author: bookDataDetail[0].author,
      year: bookDataDetail[0].year,
      isCompleted: true,
    };

    const bookData = getData().filter((a) => a.id != id);
    localStorage.setItem(localStorageKey, JSON.stringify(bookData));

    insertData(newBook);
  } else {
    return 0;
  }
  getBooksInformation();
}

function unreadedBook(id) {
  let cfm = confirm("Ingin membaca ulang buku ini ?");

  if (cfm == true) {
    const bookDataDetail = getData().filter((a) => a.id == id);
    const newBook = {
      id: bookDataDetail[0].id,
      title: bookDataDetail[0].title,
      author: bookDataDetail[0].author,
      year: bookDataDetail[0].year,
      isCompleted: false,
    };

    const bookData = getData().filter((a) => a.id != id);
    localStorage.setItem(localStorageKey, JSON.stringify(bookData));

    insertData(newBook);
  } else {
    return 0;
  }
  getBooksInformation();
}

function getBooksInformation() {
  let completed = (notCompleted = 0);
  const bookshelf = getData();

  const allBooks = bookshelf.length;

  for (let i = 0; i < allBooks; i++) {
    if (bookshelf[i]["isCompleted"]) {
      completed += 1;
    } else {
      notCompleted += 1;
    }
  }

  document.querySelector("#totalBookCount").innerHTML = allBooks;
  document.querySelector("#totalCompleteCount").innerHTML = completed;
  document.querySelector("#totalnotCompleteCount").innerHTML = notCompleted;
}

function formValidation() {
  function validation(check) {
    return check.value === "";
  }

  return validation(title) || validation(author) || validation(year);
}

function renderSearchResult(books) {
  renderData(books);
}

function clear() {
  title.value = "";
  author.value = "";
  year.value = "";
  isRead.checked = false;
}

isRead.addEventListener("change", function () {
  const isReadcheck = isRead.checked;

  if (isReadcheck) {
    document.querySelector(".isCompleted").style.display = "inline-block";
    document.querySelector(".isNotCompleted").style.display = "none";
  } else {
    document.querySelector(".isNotCompleted").style.display = "inline-block";
    document.querySelector(".isCompleted").style.display = "none";
  }
});

window.addEventListener("load", function () {
  if (localStorage.getItem(localStorageKey) !== "") {
    const booksData = getData();
    renderData(booksData);
  }
});

btnSubmit.addEventListener("click", function () {
  const formVal = formValidation();
  if (formVal) {
    alert("Semua data harus diisi dengan lengkap ya");
  } else {
    const newBook = {
      id: +new Date(),
      title: title.value.trim(),
      author: author.value.trim(),
      year: year.value,
      isCompleted: isRead.checked,
    };

    insertData(newBook);
    clear();
  }
});

btnSearch.addEventListener("click", function (e) {
  e.preventDefault();

  if (localStorage.getItem(localStorageKey) == "") {
    alert("Tidak ada data buku");
    return location.reload();
  } else {
    const getByTitle = getData().filter(
      (a) => a.title == searchValue.value.trim()
    );
    if (getByTitle.length == 0) {
      const getByAuthor = getData().filter(
        (a) => a.author == searchValue.value.trim()
      );
      if (getByAuthor.length == 0) {
        const getByYear = getData().filter(
          (a) => a.year == searchValue.value.trim()
        );
        if (getByYear.length == 0) {
          alert(`Data yang anda cari tidak ditemukan`);
          return location.reload();
        } else {
          renderSearchResult(getByYear);
        }
      } else {
        renderSearchResult(getByAuthor);
      }
    } else {
      renderSearchResult(getByTitle);
    }
  }

  searchValue.value = "";
});
