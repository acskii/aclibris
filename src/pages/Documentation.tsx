import {
  Library,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  Plus,
  Minus,
  FileMinus,
} from "lucide-react";

export default function DocumentationPage() {
  // Function to handle smooth scrolling to elements
  // @ts-ignore
  const handleLinkClick = (e, targetId: string) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen p-8 text-white">
      <div className="mb-8 flex flex-col items-start">
        <h1 className="mb-2 flex gap-3 justify-start">
          <FileMinus size={40} />
          <span className="text-4xl font-bold text-white">Documentation</span>
        </h1>
      </div>
      <div className="max-w-5xl mx-auto">
        {/* Introduction */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
          <p className="mb-4">Thanks for installing reader!</p>
          <p className="mb-4">
            I hope this application will prove useful and entertaining in some
            way or another, because it was just as fun developing it as using
            during its testing period.
          </p>
          <p>
            This documentation provides the basic instructions you need to take
            full advantage of all the application's features.
          </p>
        </section>

        {/* Table of Contents */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Table of Contents</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <a
                href="#introduction"
                onClick={(e) => handleLinkClick(e, "introduction")}
                className="text-white/80 hover:text-white hover:underline cursor-pointer"
              >
                Introduction
              </a>
            </li>
            <li>
              <a
                href="#adding-your-first-book"
                onClick={(e) => handleLinkClick(e, "adding-your-first-book")}
                className="text-white/80 hover:text-white hover:underline cursor-pointer"
              >
                Adding your first book
              </a>
            </li>
            <li>
              <a
                href="#smooth-read"
                onClick={(e) => handleLinkClick(e, "smooth-read")}
                className="text-white/80 hover:text-white hover:underline cursor-pointer"
              >
                Smooth read
              </a>
            </li>
            <li>
              <a
                href="#organisation"
                onClick={(e) => handleLinkClick(e, "organisation")}
                className="text-white/80 hover:text-white hover:underline cursor-pointer"
              >
                Organisation
              </a>
            </li>
            <li>
              <a
                href="#search-and-filter"
                onClick={(e) => handleLinkClick(e, "search-and-filter")}
                className="text-white/80 hover:text-white hover:underline cursor-pointer"
              >
                Search & Filter
              </a>
            </li>
            <li>
              <a
                href="#settings"
                onClick={(e) => handleLinkClick(e, "settings")}
                className="text-white/80 hover:text-white hover:underline cursor-pointer"
              >
                Settings
              </a>
            </li>
          </ul>
        </section>

        {/* Adding your first book */}
        <section id="adding-your-first-book" className="mb-12">
          <h3 className="text-xl font-semibold mb-4">Adding your first book</h3>
          <p className="mb-4">
            When you start the application, you will see the{" "}
            <strong className="font-semibold">Home</strong> page.
          </p>
          <p className="mb-4">
            To upload your first book, you can either click on the{" "}
            <code className="bg-white/20 px-1 py-0.5 rounded text-sm font-mono">
              Upload Your First Book
            </code>{" "}
            button in the <em>center</em> of the{" "}
            <strong className="font-semibold">Home</strong> page, or you can
            navigate to the same page using the{" "}
            <code className="bg-white/20 px-1 py-0.5 rounded text-sm font-mono">
              Upload Book
            </code>{" "}
            <strong className="font-semibold">side menu</strong> button.
          </p>

          <DocumentationImage
            src="./docs/first_book/home_page_highlighted.png"
            alt="Home page with highlights on 2 buttons"
          />

          <p className="mb-4">
            Once the <strong className="font-semibold">Upload</strong> page is
            loaded, you will see a section at the top of the page where you can
            upload your first book.
          </p>
          <p className="mb-4">
            You can drag and drop your book file directly into this section.
            Alternatively, clicking on the section will open the{" "}
            <em>File Explorer</em>, allowing you to select the file from your
            computer.
          </p>

          <Alert type="important">
            All files that you upload can{" "}
            <strong>
              <em>only</em>
            </strong>{" "}
            be <strong>.pdf</strong> files
          </Alert>

          <DocumentationImage
            src="./docs/first_book/upload_page_highlighted.png"
            alt="Upload page with highlight on file upload section"
          />

          <p className="mb-4">
            On successful upload, the section will turn <em>green</em> and
            display an option to remove the file if you wish to replace it.
          </p>

          <DocumentationImage
            src="./docs/first_book/upload_page_success_remove.png"
            alt="Upload section with highlight on remove button"
          />

          <p className="mb-4">
            Once the upload is complete, two new sections will appear below:{" "}
            <strong>
              <em>File Information</em>
            </strong>{" "}
            and{" "}
            <strong>
              <em>Organisation</em>
            </strong>
            .
          </p>
          <p className="mb-4">
            In the File Information section, <strong>6</strong> fields will show
            basic information that we already saved within the uploaded PDF's
            metadata, including:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>
              Title: <em>Can be edited</em>
            </li>
            <li>
              Author: <em>Can be edited</em>
            </li>
            <li>
              Pages: <em>Read only</em>
            </li>
            <li>
              File Size: <em>Read only</em>
            </li>
            <li>
              Creation date: <em>Read only</em>
            </li>
          </ul>
          <p className="mb-4">
            The final field is the <strong>thumbnail</strong>, which is a
            screenshot of the first page of your PDF. You can disable this
            feature from the <strong className="font-semibold">Settings</strong>{" "}
            page.
          </p>
          <p className="mb-4">
            Check out{" "}
            <a
              href="#settings"
              onClick={(e) => handleLinkClick(e, "settings")}
              className="text-white/80 hover:text-white hover:underline cursor-pointer"
            >
              Setting up preferences
            </a>{" "}
            for more information.
          </p>

          <DocumentationImage
            src="./docs/first_book/upload_page_success_information.png"
            alt="File Information section with highlight on editable fields"
          />

          <p className="mb-4">
            In the Organisation section, set the{" "}
            <strong className="font-semibold">Collection</strong> as{" "}
            <code className="bg-white/20 px-1 py-0.5 rounded text-sm font-mono">
              Default
            </code>{" "}
            for now.
          </p>
          <p className="mb-4">
            As this is a tutorial for adding your first book, advanced
            organisation is not necessary. However, organisation is a{" "}
            <em>significant</em> feature within the application.
          </p>
          <p className="mb-4">
            You can learn more about organisation methods from{" "}
            <a
              href="#organisation"
              onClick={(e) => handleLinkClick(e, "organisation")}
              className="text-white/80 hover:text-white hover:underline cursor-pointer"
            >
              Organisation
            </a>{" "}
            section.
          </p>

          <DocumentationImage
            src="./docs/first_book/upload_page_success_organisation.png"
            alt="Organisation section"
          />

          <p className="mb-4">
            Click on{" "}
            <code className="bg-white/20 px-1 py-0.5 rounded text-sm font-mono">
              Save Book
            </code>{" "}
            to save your first book!
          </p>
          <p className="mb-4">
            Now to read your first book, you can access it through the{" "}
            <strong className="font-semibold">Library</strong> page.
          </p>
          <p className="mb-4">
            After saving, you will be automatically redirected to the{" "}
            <strong className="font-semibold">Library</strong> page. You can
            also navigate there at any time using the{" "}
            <code className="bg-white/20 px-1 py-0.5 rounded text-sm font-mono">
              Library
            </code>{" "}
            <strong className="font-semibold">side menu</strong> button.
          </p>
          <p className="mb-4">
            You should see a{" "}
            <code className="bg-white/20 px-1 py-0.5 rounded text-sm font-mono">
              Default
            </code>{" "}
            <strong className="font-semibold">shelf</strong> containing a{" "}
            <code className="bg-white/20 px-1 py-0.5 rounded text-sm font-mono">
              Default
            </code>{" "}
            <strong className="font-semibold">collection</strong>. Click on the
            collection to open it.
          </p>

          <DocumentationImage
            src="./docs/first_book/library_page_collection_highlighted.png"
            alt="Library page with default collection highlighted"
          />

          <p className="mb-4">
            This is the <strong className="font-semibold">Collection</strong>{" "}
            page, which displays all books stored within the collection you
            selected.
          </p>
          <p className="mb-4">
            Here you can select a book to read, and its details will show on the{" "}
            <em>left-hand</em> side of the screen (or at the <em>top</em>,
            depending on your window resolution).
          </p>

          <DocumentationImage
            src="./docs/first_book/collection_page.png"
            alt="Collection page"
          />

          <p className="mb-4">
            The book details section shows all the information saved from the{" "}
            <strong className="font-semibold">Upload</strong> page, along with{" "}
            <strong>2</strong> buttons:{" "}
            <code className="bg-white/20 px-1 py-0.5 rounded text-sm font-mono">
              Read This Book
            </code>{" "}
            and{" "}
            <code className="bg-white/20 px-1 py-0.5 rounded text-sm font-mono">
              Edit Book
            </code>
            .
          </p>
          <p className="mb-4">
            Click on the{" "}
            <code className="bg-white/20 px-1 py-0.5 rounded text-sm font-mono">
              Read This Book
            </code>{" "}
            button to read your first book!
          </p>

          <DocumentationImage
            src="./docs/first_book/collection_page_book_details.png"
            alt="Book details section"
          />

          <p className="mb-4">
            You can now upload more books and know where to read them.
          </p>
          <p>
            It is recommended to learn more about organising your books in the{" "}
            <a
              href="#organisation"
              onClick={(e) => handleLinkClick(e, "organisation")}
              className="text-white/80 hover:text-white hover:underline cursor-pointer"
            >
              Organisation
            </a>{" "}
            section, or go to the next section{" "}
            <a
              href="#smooth-read"
              onClick={(e) => handleLinkClick(e, "smooth-read")}
              className="text-white/80 hover:text-white hover:underline cursor-pointer"
            >
              Smooth read
            </a>{" "}
            to learn more about the features available on the{" "}
            <strong className="font-semibold">View</strong> page.
          </p>
        </section>

        {/* Smooth read */}
        <section id="smooth-read" className="mb-12">
          <h3 className="text-xl font-semibold mb-4">Smooth read</h3>
          <p className="mb-4">
            After opening a book, you are directed to the{" "}
            <strong className="font-semibold">View</strong> page, the heart of
            the application.
          </p>
          <p className="mb-4">
            Any book you open will render{" "}
            <strong>
              <em>page by page</em>
            </strong>
            , and the open page will fill the entire preview area, as
            highlighted below.
          </p>

          <DocumentationImage
            src="./docs/smooth_read/view_page_preview.png"
            alt="View page with preview highlighted"
          />

          <p className="mb-4">
            Above the preview, you can see several controls for navigating and
            adjusting the content.
          </p>
          <p className="mb-4">
            On the far left is the{" "}
            <code className="bg-white/20 px-1 py-0.5 rounded text-sm font-mono">
              Library
            </code>{" "}
            <Library className="inline align-text-bottom" size={20} /> button,
            which returns you to the{" "}
            <strong className="font-semibold">Library</strong> page. You can
            consider it the exit button of the page.
          </p>
          <p className="mb-4">
            On the far right are the{" "}
            <strong className="font-semibold">page controls</strong>, where you
            can navigate the book you are currently viewing.
          </p>

          <DocumentationImage
            src="./docs/smooth_read/preview_controls_page_controls.png"
            alt="Page controls with page controls highlighted"
          />

          <p className="mb-4">
            Here are the control functions in order, assume a book has{" "}
            <em>n</em> total pages and you are currently viewing page <em>c</em>
            :
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-3">
            <li>
              <strong>Turn to First</strong>{" "}
              <ChevronsLeft className="inline align-text-bottom" size={15} />
              <br />
              <span>
                Jumps to <strong>page 1</strong>.
              </span>
            </li>
            <li>
              <strong>Turn to Previous</strong>{" "}
              <ChevronLeft className="inline align-text-bottom" size={15} />
              <br />
              <span>
                Goes to the previous page,{" "}
                <strong>
                  page <em>c</em> - 1
                </strong>{" "}
                (<em>c</em> &gt; 1) of the book.
              </span>
            </li>
            <li>
              <strong>
                Page Count ( <em>c</em> / <em>n</em> )
              </strong>
              <br />
              <span>
                You can click on the highlighted area to edit the page number
                directly. The number must be between <strong>1</strong> and{" "}
                <em>n</em>.
              </span>
              <DocumentationImage
                src="./docs/smooth_read/page_count_highlighted.png"
                alt="Page count highlighted"
              />
            </li>
            <li>
              <strong>Turn to Next</strong>{" "}
              <ChevronRight className="inline align-text-bottom" size={15} />
              <br />
              <span>
                Advances to the next page,{" "}
                <strong>
                  page <em>c</em> + 1
                </strong>{" "}
                (<em>c</em> &lt; <em>n</em>) of the book.
              </span>
            </li>
            <li>
              <strong>Turn to Last</strong>{" "}
              <ChevronsRight className="inline align-text-bottom" size={15} />
              <br />
              <span>
                Jumps to the <strong>last page</strong> (page <em>n</em>).
              </span>
            </li>
          </ul>

          <p className="mb-4">
            There is also a <strong className="font-semibold">zoom</strong> in
            and out feature, which you can control using the buttons
            highlighted.
          </p>

          <DocumentationImage
            src="./docs/smooth_read/preview_controls_zoom.png"
            alt="Preview controls with zoom highlighted"
          />

          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>
              The minimum zoom is <strong>100%</strong> and the maximum is{" "}
              <strong>200%</strong> when the window is fullscreen.
            </li>
            <li>
              For smaller windows, the minimum zoom is <strong>80%</strong> and
              the maximum is <strong>100%</strong>.
            </li>
            <li>
              Click the <Plus className="inline align-text-bottom" size={15} />{" "}
              (plus) button to zoom in.
            </li>
            <li>
              Click the <Minus className="inline align-text-bottom" size={15} />{" "}
              (minus) button to zoom out.
            </li>
          </ul>

          <p>
            These are all the current features on the{" "}
            <strong className="font-semibold">View</strong> page, more are
            expected to come.
          </p>
          <p className="font-medium mt-4">Happy reading!</p>
        </section>

        {/* Organisation */}
        <section id="organisation" className="mb-12">
          <h3 className="text-xl font-semibold mb-4">Organisation</h3>
          <p className="mb-4">
            In this application, there are currently <strong>3</strong>{" "}
            different methods that you can utilise to organise your books.
          </p>
          <p className="mb-4">
            The inspiration is from a library shelf.{" "}
            <strong className="font-semibold">Shelves</strong> represent genres,{" "}
            <strong className="font-semibold">Collections</strong> represent
            series and <strong className="font-semibold">Tags</strong> are,
            well, tags.
          </p>
          <p className="mb-4">
            You are not obligated to follow this analogy strictly, but it
            provides a useful framework.
          </p>
          <p className="mb-4">
            The <strong className="font-semibold">Library</strong> page will by
            default have one shelf{" "}
            <code className="bg-white/20 px-1 py-0.5 rounded text-sm font-mono">
              Default
            </code>{" "}
            and within it one collection{" "}
            <code className="bg-white/20 px-1 py-0.5 rounded text-sm font-mono">
              Default
            </code>
            .
          </p>
          <p className="mb-4">
            <strong className="font-semibold">Shelves</strong> and{" "}
            <strong className="font-semibold">Collections</strong> can only be
            created in the <strong className="font-semibold">Upload</strong>{" "}
            page or on{" "}
            <a
              href="#book-details"
              onClick={(e) => handleLinkClick(e, "book-details")}
              className="text-white/80 hover:text-white hover:underline cursor-pointer"
            >
              book details
            </a>{" "}
            edit. When selecting a shelf or a collection, you can choose from
            existing ones using the drop-down menu. Alternatively, typing a{" "}
            <em>new name</em> will automatically create it for you.
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-4">
            <li>
              Each <strong className="font-semibold">shelf</strong> can hold
              multiple <strong className="font-semibold">collections</strong>.
              You can rename or delete a shelf using the buttons highlighted
              below.
              <DocumentationImage
                src="./docs/organisation/library_page_shelf.png"
                alt="Edit and rename shelf buttons"
              />
            </li>
            <li>
              Each <strong className="font-semibold">collection</strong> can
              contain multiple books. You can rename or delete a collection
              using the buttons highlighted below.
              <DocumentationImage
                src="./docs/organisation/collection_page_buttons.png"
                alt="Edit and rename collection buttons"
              />
            </li>
          </ul>

          <Alert type="important">
            Deleting a shelf or a collection will{" "}
            <strong>
              <em>permanently remove</em>
            </strong>{" "}
            <strong>all</strong> books contained within it from your library.
          </Alert>

          <p className="mb-4">
            <strong className="font-semibold">Tags</strong> are <em>labels</em>{" "}
            that can be attached to books individually.
          </p>
          <p className="mb-4">
            Tags are flexible labels you can attach to individual books. They
            are useful for identifying themes and content, which helps with
            searching and filtering on the{" "}
            <strong className="font-semibold">Search</strong> page. See{" "}
            <a
              href="#search-and-filter"
              onClick={(e) => handleLinkClick(e, "search-and-filter")}
              className="text-white/80 hover:text-white hover:underline cursor-pointer"
            >
              Search & Filter
            </a>{" "}
            for more information.
          </p>
          <p className="mb-4">
            Similar to <strong className="font-semibold">shelves</strong> and{" "}
            <strong className="font-semibold">collections</strong>,{" "}
            <strong className="font-semibold">tags</strong> can be added from
            the <strong className="font-semibold">Upload</strong> page or the{" "}
            <a
              href="#book-details"
              onClick={(e) => handleLinkClick(e, "book-details")}
              className="text-white/80 hover:text-white hover:underline cursor-pointer"
            >
              book details
            </a>
            .
          </p>
          <p className="mb-4">
            To add a <strong className="font-semibold">tag</strong>, type its
            name into the field and click the{" "}
            <Plus className="inline align-text-bottom" size={15} /> (plus)
            button. You can also quickly add previously created tags from the{" "}
            <code className="bg-white/20 px-1 py-0.5 rounded text-sm font-mono">
              Quick Add
            </code>{" "}
            section or the drop-down menu.
          </p>

          <DocumentationImage
            src="./docs/organisation/book_details_tag_editor.png"
            alt="Tag editor section"
          />

          <div id="book-details"></div>
          <p className="mb-4">
            To access a{" "}
            <strong className="font-semibold">book's details</strong>, select it
            from a <strong className="font-semibold">Collection</strong> page
            and click the{" "}
            <code className="bg-white/20 px-1 py-0.5 rounded text-sm font-mono">
              Edit Book
            </code>{" "}
            button in the details section, as highlighted below.
          </p>

          <DocumentationImage
            src="./docs/organisation/collection_details_edit.png"
            alt="Collection page with edit book button highlighted"
          />

          <p className="mb-4">
            Within the <strong className="font-semibold">book details</strong>,
            you can modify the book's <em>title</em>, <em>author</em>,{" "}
            <em>thumbnail</em>, <strong className="font-semibold">shelf</strong>
            , <strong className="font-semibold">collection</strong> and{" "}
            <strong className="font-semibold">tags</strong>.
          </p>
          <p className="mb-4">
            You can also delete the book from your library by clicking the{" "}
            <code className="bg-white/20 px-1 py-0.5 rounded text-sm font-mono">
              Delete this book
            </code>{" "}
            button, as shown below.
          </p>

          <Alert type="important">
            Deleting a book from the library will <strong>not</strong> delete
            the <em>original</em> PDF file from your computer.
          </Alert>

          <DocumentationImage
            src="./docs/organisation/book_details_delete.png"
            alt="Book details page with delete button zoomed in"
          />

          <p className="mb-4">
            You can replace the book's thumbnail by hovering over the current
            one, and clicking to upload a new image.
          </p>

          <DocumentationImage
            src="./docs/organisation/book_details_thumbnail.png"
            alt="Book details page with thumbnail zoomed in"
          />

          <p>
            Remember to click on the{" "}
            <code className="bg-white/20 px-1 py-0.5 rounded text-sm font-mono">
              Add Changes
            </code>{" "}
            button at the bottom of the page to persist changes.
          </p>

          <DocumentationImage
            src="./docs/organisation/book_details_add_changes.png"
            alt="Book details page with tag section zoomed in"
          />
        </section>

        {/* Search and Filter */}
        <section id="search-and-filter" className="mb-12">
          <h3 className="text-xl font-semibold mb-4">Search and Filter</h3>
          <p className="mb-4">
            You can navigate to the{" "}
            <strong className="font-semibold">Search</strong> page using the{" "}
            <code className="bg-white/20 px-1 py-0.5 rounded text-sm font-mono">
              Search
            </code>{" "}
            <strong className="font-semibold">side menu</strong> button. Then
            you are directed to a page as shown below.
          </p>

          <DocumentationImage
            src="./docs/search/search_page.png"
            alt="Search page"
          />

          <p className="mb-4">
            All books that have been uploaded are shown here, each as a card.
          </p>

          <DocumentationImage
            src="./docs/search/book_card.png"
            alt="Book Card"
          />

          <p className="mb-4">
            Here are the information placements, in order from top:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>Title</li>
            <li>Tags</li>
            <li>Author</li>
            <li>Shelf</li>
            <li>Collection</li>
            <li>Creation date</li>
          </ul>
          <p className="mb-4">
            Clicking on a book card will redirect you to the{" "}
            <strong className="font-semibold">View</strong> page to start
            reading.
          </p>

          <h4 className="text-lg font-semibold mb-4">Using Filters</h4>
          <p className="mb-4">
            Use the search filters to narrow down the results and find a
            specific book or a group of similar books.
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-4">
            <li>
              <strong className="font-semibold">Search Bar</strong>
              <br />
              <span>
                Use this to find books by their{" "}
                <strong className="font-semibold">title</strong> or{" "}
                <em>
                  <strong className="font-semibold">author</strong>
                </em>
                .
              </span>
              <DocumentationImage
                src="./docs/search/search_page_bar.png"
                alt="Search filters - search bar"
              />
            </li>
            <li>
              <strong className="font-semibold">Shelf filter</strong>
              <br />
              <span>
                Use this to show only the books belonging to a specific shelf.
                You can select from your existing shelves.
              </span>
              <DocumentationImage
                src="./docs/search/search_filter_shelf.png"
                alt="Search filters - shelf filter"
              />
            </li>
            <li>
              <strong className="font-semibold">Collection filter</strong>
              <br />
              <span>
                Use this to show only the books belonging to a specific
                collection. You can select from your existing collections.
              </span>
              <DocumentationImage
                src="./docs/search/search_filter_collection.png"
                alt="Search filters - collection filter"
              />
            </li>
          </ul>

          <p className="mb-4">
            Selecting a collection first will{" "}
            <strong className="font-semibold">automatically select</strong> the
            shelf it belongs to, and selecting a shelf will{" "}
            <strong className="font-semibold">limit</strong> the collections
            that you can filter to only the ones within it.
          </p>

          <ul className="list-disc pl-6 mb-4 space-y-4">
            <li>
              <strong className="font-semibold">Tag filter</strong>
              <br />
              <span>
                Use this to show only books that contain{" "}
                <strong className="font-semibold">all</strong> of the selected
                tags. You can select one or more tags from your existing list.
              </span>
              <DocumentationImage
                src="./docs/search/search_filter_tags.png"
                alt="Search filters - tag filter"
              />
            </li>
          </ul>

          <p>
            You can apply any combination of these filters to refine your
            search. Only apply the filters you need to find your books.
          </p>
        </section>

        {/* Settings */}
        <section id="settings" className="mb-12">
          <h3 className="text-xl font-semibold mb-4">Settings</h3>

          <Alert type="note">
            The number of adjustable settings is currently limited, but more
            options are planned for future updates.
          </Alert>

          <p className="mb-4">
            You can navigate to the{" "}
            <strong className="font-semibold">Settings</strong> page using the{" "}
            <code className="bg-white/20 px-1 py-0.5 rounded text-sm font-mono">
              Settings
            </code>{" "}
            <strong className="font-semibold">side menu</strong> button. Then
            you are directed to a page as shown below.
          </p>

          <DocumentationImage
            src="./docs/settings/settings_page.png"
            alt="Settings page"
          />

          <p className="mb-4">
            The section shown above is the{" "}
            <strong className="font-semibold">Application Settings</strong>,
            which give control over application-wide changes.
          </p>
          <p className="mb-4">At the top, you will find two buttons:</p>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>
              <code className="bg-white/20 px-1 py-0.5 rounded text-sm font-mono">
                Reset to Default
              </code>{" "}
              reverts all settings to their original values.
            </li>
            <li>
              <code className="bg-white/20 px-1 py-0.5 rounded text-sm font-mono">
                Save
              </code>{" "}
              saves any new changes you have made.
            </li>
          </ul>

          <p className="mb-4">The following settings are available:</p>
          <ul className="list-disc pl-6 space-y-3">
            <li>
              <strong>
                <code className="bg-white/20 px-1 py-0.5 rounded text-sm font-mono">
                  Save Last Viewed Pages
                </code>
              </strong>
              <br />
              <span>
                When{" "}
                <em>
                  <strong>toggled</strong>
                </em>{" "}
                on, the application will remember the last page you were viewing
                in a book. When you reopen that book, it will automatically
                return to that page.
              </span>
            </li>
            <li>
              <strong>
                <code className="bg-white/20 px-1 py-0.5 rounded text-sm font-mono">
                  Load Recent Book
                </code>
              </strong>
              <br />
              <span>
                When{" "}
                <em>
                  <strong>toggled</strong>
                </em>{" "}
                on, the Home page will display a section with your most recently
                viewed book, allowing you to quickly resume reading.
              </span>
              <DocumentationImage
                src="./docs/settings/last_viewed_page.png"
                alt="Last viewed page section"
              />
            </li>
            <li>
              <strong>
                <code className="bg-white/20 px-1 py-0.5 rounded text-sm font-mono">
                  Generate Thumbnails
                </code>
              </strong>
              <br />
              <span>
                When{" "}
                <em>
                  <strong>toggled</strong>
                </em>{" "}
                on, a <em>thumbnail</em>, a screenshot of the first page, will
                be automatically generated for every book you upload.
              </span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}

// Custom components for markdown elements that need special handling

function DocumentationImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="my-6 border border-gray-300 rounded-md overflow-hidden max-w-2xl mx-auto">
      <img src={src} alt={alt} className="w-full h-auto" />
      <div className="px-4 py-2 bg-gray-100 text-sm text-gray-600 border-t border-gray-300">
        {alt}
      </div>
    </div>
  );
}

function Alert({ type, children }: { type: string; children: any }) {
  const baseClasses = "my-6 p-4 rounded-md border-l-4";

  return (
    <div
      className={`${baseClasses} ${
        type == "important"
          ? "bg-red-50 border-red-400 text-red-700"
          : "bg-blue-50 border-blue-400 text-blue-700"
      }`}
    >
      <div className="font-semibold mb-1">
        {type === "important" && "Important"}
        {type === "note" && "Note"}
      </div>
      <div>{children}</div>
    </div>
  );
}
