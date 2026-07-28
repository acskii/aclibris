import React from "react";
import { Info, TriangleAlert, Layers, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, Plus, Minus } from "lucide-react";

function DocumentationImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="my-6 rounded-lg overflow-hidden border border-white/10 bg-white/5 p-2 shadow-lg">
      <img src={src} alt={alt} className="w-full h-auto rounded" />
      <p className="text-xs text-white font-semibold mt-2 text-center">{alt}</p>
    </div>
  );
}

function Alert({ children, type }: { children: React.ReactNode; type: "important" | "info" }) {
  const styles = type === "important" ? "bg-red-500/20 border-red-500/50" : "bg-blue-500/20 border-blue-500/50";
  const Icon = type === "important" ? TriangleAlert : Info;

  return (
    <div className={`p-4 rounded-lg border my-4 flex gap-3 items-start ${styles}`}>
      <Icon size={20} className="shrink-0 mt-0.5" />
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  );
}

export default function DocumentationPage() {
  // Function to handle smooth scrolling to elements
  // @ts-ignore
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-slate-200">
      <h1 className="text-3xl font-bold mb-6 border-b border-white/10 pb-2">Documentation</h1>

      {/* Introduction */}
      <section id="introduction" className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-white">Introduction</h2>
        <p className="mb-3 leading-relaxed">Thanks for installing Aclibris!</p>
        <p className="mb-3 leading-relaxed">
          I hope this application will prove useful and entertaining in some way or another, because it was just as fun developing it as using during its testing period.
        </p>
        <p className="leading-relaxed">
          This documentation provides the basic instructions you need to take full advantage of all the application's features.
        </p>
      </section>

      {/* Table of Contents */}
      <section className="mb-12 p-6">
        <h3 className="text-xl font-semibold mb-3 text-white">Table of Contents</h3>
        <ul className="space-y-2 list-disc list-inside text-white">
          <li><a href="#introduction" onClick={(e) => handleLinkClick(e, "introduction")} className="hover:underline">Introduction</a></li>
          <li><a href="#adding-your-first-book" onClick={(e) => handleLinkClick(e, "adding-your-first-book")} className="hover:underline">Adding your first book</a></li>
          <li><a href="#book-types" onClick={(e) => handleLinkClick(e, "book-types")} className="hover:underline">Book Types</a></li>
          <li><a href="#smooth-read" onClick={(e) => handleLinkClick(e, "smooth-read")} className="hover:underline">Smooth read</a></li>
          <li><a href="#organisation" onClick={(e) => handleLinkClick(e, "organisation")} className="hover:underline">Organisation</a></li>
          <li><a href="#search-and-filter" onClick={(e) => handleLinkClick(e, "search-and-filter")} className="hover:underline">Search &amp; Filter</a></li>
          <li><a href="#settings" onClick={(e) => handleLinkClick(e, "settings")} className="hover:underline">Settings</a></li>
          <li>
            <a href="#batch-mode" onClick={(e) => handleLinkClick(e, "batch-mode")} className="hover:underline">
              Batch Mode <span className="text-amber-400 text-xs font-bold uppercase tracking-wider ml-1">[EXPERIMENTAL]</span>
            </a>
          </li>
        </ul>
      </section>

      {/* Adding your first book */}
      <section id="adding-your-first-book" className="mb-12">
        <h3 className="text-xl font-semibold mb-4 text-white border-b border-white/10 pb-1">Adding your first book</h3>
        <p className="mb-4">
          When you start the application, you will see the <strong className="text-white">Library</strong> page.
        </p>
        <p className="mb-4">
          To upload your first book, you can either click on the <code className="bg-white/10 px-1.5 py-0.5 rounded text-sm">Upload Book</code> button on the <em>right</em> side of the welcome header, or you can navigate to the same page using the <code className="bg-white/10 px-1.5 py-0.5 rounded text-sm">Upload Book</code> <strong>side menu</strong> button.
        </p>

        <DocumentationImage src="./docs/first_book/library_page_upload_highlighted.png" alt="Library page with highlights on 2 buttons" />

        <p className="mb-4">
          Once the <strong>Upload</strong> page is loaded, you will see a section at the top of the page where you can upload your first book.
        </p>

        <Alert type="important">
          <p>All files that you upload can <strong><em>only</em></strong> be <strong>.pdf</strong> files</p>
        </Alert>

        <p className="mb-2">There are two ways to upload books onto the application:</p>
        <ul className="list-disc list-inside mb-4 space-y-1">
          <li><strong>Single Mode</strong></li>
          <li><strong>Batch Mode</strong> (See at <a href="#batch-mode" onClick={(e) => handleLinkClick(e, "batch-mode")} className="text-sky-400 hover:underline">Batch Mode</a>)</li>
        </ul>

        <p className="mb-4">We will focus on <em>single</em> mode for this section.</p>
        <p className="mb-4">
          You can see on the <em>left</em> side of this section a <strong>Drag and Drop</strong> section.
        </p>
        <p className="mb-4">
          You can drag and drop your book file directly into this section. Alternatively, clicking on the section will open the <em>File Explorer</em>, allowing you to select the file from your computer.
        </p>

        <DocumentationImage src="./docs/first_book/upload_page_single_highlighted.png" alt="Upload page with highlight on single mode upload section" />

        <p className="mb-4">
          On successful upload, the section will turn <em>green</em> and display an option to remove the file if you wish to replace it.
        </p>

        <DocumentationImage src="./docs/first_book/upload_page_success_remove.png" alt="Upload section with highlight on remove button" />

        <p className="mb-4">
          Once the upload is complete, two new sections will appear below: <strong><em>File Information</em></strong> and <strong><em>Organisation</em></strong>.
        </p>
        <p className="mb-2">
          In the File Information section, <strong>6</strong> fields will show basic information that we already saved within the uploaded PDF's metadata, including:
        </p>
        <ul className="list-disc list-inside mb-4 space-y-1">
          <li>Title: <em>Can be edited</em></li>
          <li>Author: <em>Can be edited</em></li>
          <li>Pages: <em>Read only</em></li>
          <li>File Size: <em>Read only</em></li>
          <li>Creation date: <em>Read only</em></li>
        </ul>

        <p className="mb-4">
          The final field is the <strong>thumbnail</strong>, which is a screenshot of the first page of your PDF. You can disable this feature from the <strong>Settings</strong> page.
        </p>
        <p className="mb-4">
          Check out <a href="#settings" onClick={(e) => handleLinkClick(e, "settings")} className="text-sky-400 hover:underline">Setting up preferences</a> for more information.
        </p>

        <DocumentationImage src="./docs/first_book/upload_page_success_information.png" alt="File Information section with highlight on editable fields" />

        <p className="mb-4">
          In the Organisation section, set the <strong>Collection</strong> as <code className="bg-white/10 px-1.5 py-0.5 rounded text-sm">Default</code> for now.
        </p>
        <p className="mb-4">
          You can change how a book is viewed when reading by modifying the <strong>Choose Book View</strong> option. See the options and their differences at the <a href="#book-types" onClick={(e) => handleLinkClick(e, "book-types")} className="text-sky-400 hover:underline">Book Types</a> section.
        </p>
        <p className="mb-4">
          As this is a tutorial for adding your first book, advanced organisation is not necessary. However, organisation is a <em>significant</em> feature within the application.
        </p>
        <p className="mb-4">
          You can learn more about organisation methods from the <a href="#organisation" onClick={(e) => handleLinkClick(e, "organisation")} className="text-sky-400 hover:underline">Organisation</a> section.
        </p>

        <DocumentationImage src="./docs/first_book/upload_page_success_organisation.png" alt="Organisation section" />

        <p className="mb-4">
          Click on <code className="bg-white/10 px-1.5 py-0.5 rounded text-sm">Save Book</code> to save your first book!
        </p>
        <p className="mb-4">
          Now to read your first book, you can access it through the <strong>Library</strong> page.
        </p>
        <p className="mb-4">
          After saving, you will be automatically redirected to the <strong>Library</strong> page. You can also navigate there at any time using the <code className="bg-white/10 px-1.5 py-0.5 rounded text-sm">Library</code> <strong>side menu</strong> button.
        </p>
        <p className="mb-4">
          You should see a <code className="bg-white/10 px-1.5 py-0.5 rounded text-sm">Default</code> <strong>shelf</strong> containing a <code className="bg-white/10 px-1.5 py-0.5 rounded text-sm">Default</code> <strong>collection</strong>. Click on the collection to open it.
        </p>

        <DocumentationImage src="./docs/first_book/library_page_collection_highlighted.png" alt="Library page with default collection hightlighted" />

        <p className="mb-4">
          This is the <strong>Collection</strong> page, which displays all books stored within the collection you selected.
        </p>
        <p className="mb-4">
          Here you can select a book to read, and its details will show on the <em>left-hand</em> side of the screen (or at the <em>top</em>, depending on your window resolution).
        </p>

        <DocumentationImage src="./docs/first_book/collection_page.png" alt="Collection page" />

        <p className="mb-4">
          The book details section shows all the information saved from the <strong>Upload</strong> page, along with <strong>2</strong> buttons: <code className="bg-white/10 px-1.5 py-0.5 rounded text-sm">Read This Book</code> and <code className="bg-white/10 px-1.5 py-0.5 rounded text-sm">Edit Book</code>.
        </p>
        <p className="mb-4">
          Click on the <code className="bg-white/10 px-1.5 py-0.5 rounded text-sm">Read This Book</code> button to read your first book!
        </p>

        <DocumentationImage src="./docs/first_book/collection_page_book_details.png" alt="Book details section" />

        <p className="mb-4">You can now upload more books and know where to read them.</p>
        <p>
          It is recommended to learn more about organising your books in the <a href="#organisation" onClick={(e) => handleLinkClick(e, "organisation")} className="text-sky-400 hover:underline">Organisation</a> section, or go to the next section <a href="#book-types" onClick={(e) => handleLinkClick(e, "book-types")} className="text-sky-400 hover:underline">Book Types</a> to learn more about available book views.
        </p>
      </section>

      {/* Book Types */}
      <section id="book-types" className="mb-12">
        <h3 className="text-xl font-semibold mb-4 text-white border-b border-white/10 pb-1">Book Types</h3>
        <p className="mb-4">
          There are currently <em>two</em> views a book can be set to change the reading experience in the <strong>View</strong> page:
        </p>

        <ul className="space-y-6 mb-6">
          <li>
            <strong className="text-white text-lg block mb-2">One page</strong>
            <p className="mb-2">
              This is the standard book view which uses the <strong><em>page by page</em></strong> render that only views <strong>one page</strong> at a time.
            </p>
            <p className="mb-2">Navigation is done using the page control within the <strong>View</strong> page.</p>
            <p className="mb-4">Zoom in/out is supported in this mode.</p>
            <DocumentationImage src="./docs/book_types/one_page.png" alt="View page with one page view" />
          </li>

          <li>
            <strong className="text-white text-lg block mb-2">Vertical Strip</strong>
            <p className="mb-2">
              This is the <em>webtoon</em> view which uses the <strong><em>panels by scroll</em></strong> render that treats each page within the book as a long stripe <strong>panel</strong> and only views the panel based on the position of your scroll.
            </p>
            <p className="mb-2">
              This mode enforces the <em>standard webtoon width</em> for a panel of <strong>800px</strong> to prevent inconsistencies while scrolling.
            </p>
            <p className="mb-2">Page navigation is not supported since panels are viewed by scrolling.</p>
            <p className="mb-4">Zoom in/out is supported in this mode.</p>
            <DocumentationImage src="./docs/book_types/vertical_strip.png" alt="View page with vertical strip view" />
          </li>
        </ul>

        <p className="mb-4">
          You can change how a book is viewed right when you upload it using the <strong>Choose Book View</strong> option in the <strong>Upload</strong> page.
        </p>
        <DocumentationImage src="./docs/book_types/upload_page_book_view.png" alt="Book View option in Upload page" />

        <p className="mb-4">
          You can find the same option within the <strong>Book Details</strong> page if you ever need to change the view option you set up on upload.
        </p>
        <DocumentationImage src="./docs/book_types/book_details_book_view.png" alt="Book View option in Book Details page" />

        <p>
          For more information on reading, go to the next section <a href="#smooth-read" onClick={(e) => handleLinkClick(e, "smooth-read")} className="text-sky-400 hover:underline">Smooth read</a> to learn more about the features available on the <strong>View</strong> page.
        </p>
      </section>

      {/* Smooth read */}
      <section id="smooth-read" className="mb-12">
        <h3 className="text-xl font-semibold mb-4 text-white border-b border-white/10 pb-1">Smooth read</h3>
        <p className="mb-4">
          Aftering opening a book, you are directed to the <strong>View</strong> page, the heart of the application.
        </p>
        <DocumentationImage src="./docs/smooth_read/view_page.png" alt="View page" />

        <p className="mb-4">Above the page preview, you can see several controls for navigating and adjusting the content.</p>
        <p className="mb-4">
          On the far left is the <code className="bg-white/10 px-1.5 py-0.5 rounded text-sm inline-flex items-center gap-1">Collection <Layers size={16} /></code> button, which returns you to the <strong>Collection</strong> page that contains the opened book. You can consider it as the exit button of the page.
        </p>

        <p className="mb-4">
          On the far right are the <strong>page controls</strong>, where you can navigate the book you are currently viewing.
        </p>
        <DocumentationImage src="./docs/smooth_read/preview_controls_page_controls.png" alt="Page controls with page controls highlighted" />

        <p className="mb-3">Here are the control functions in order, assume a book has <em>n</em> total pages and you are currently viewing page <em>c</em> :</p>

        <ul className="space-y-4 mb-6 list-disc list-inside">
          <li>
            <span className="inline-flex items-center gap-1 font-semibold text-white">
              Turn to <strong>First</strong> <ChevronsLeft size={16} />
            </span>
            <p className="pl-6 text-sm mt-1">Jumps to <strong>page 1</strong>.</p>
          </li>
          <li>
            <span className="inline-flex items-center gap-1 font-semibold text-white">
              Turn to <strong>Previous</strong> <ChevronLeft size={16} />
            </span>
            <p className="pl-6 text-sm mt-1">
              Goes to the previous page, <strong>page <em>c</em> - 1</strong> ( <em>c</em> &gt; 1 ) of the book.
            </p>
          </li>
          <li>
            <span className="font-semibold text-white">Page Count ( <em>c</em> / <em>n</em> )</span>
            <p className="pl-6 text-sm mt-1">
              You can click on the highlighted area to edit the page number directly. The number must be between <strong>1</strong> and <em>n</em>.
            </p>
            <DocumentationImage src="./docs/smooth_read/page_count_highlighted.png" alt="Page count highlighted" />
          </li>
          <li>
            <span className="inline-flex items-center gap-1 font-semibold text-white">
              Turn to <strong>Next</strong> <ChevronRight size={16} />
            </span>
            <p className="pl-6 text-sm mt-1">
              Advances to the next page, <strong>page <em>c</em> + 1</strong> ( <em>c</em> &lt; <em>n</em> ) of the book.
            </p>
          </li>
          <li>
            <span className="inline-flex items-center gap-1 font-semibold text-white">
              Turn to <strong>Last</strong> <ChevronsRight size={16} />
            </span>
            <p className="pl-6 text-sm mt-1">Jumps to the <strong>last page</strong> (page <em>n</em>).</p>
          </li>
        </ul>

        <p className="mb-4">There is also a <strong>zoom</strong> in and out feature, which you can controls using the buttons highlighted.</p>
        <DocumentationImage src="./docs/smooth_read/preview_controls_zoom.png" alt="Preview controls with zoom highlighted" />

        <ul className="list-disc list-inside space-y-2 mb-4">
          <li>The minimum zoom is <strong>50%</strong> and the maximum is <strong>200%</strong>.</li>
          <li className="inline-flex items-center gap-1">
            Click the <Plus size={15} /> (plus) button to zoom in.
          </li>
          <li className="inline-flex items-center gap-1">
            Click the <Minus size={15} /> (minus) button to zoom out.
          </li>
        </ul>

        <p className="mb-2">These are all the current features on the <strong>View</strong> page, more are expected to come.</p>
        <p className="font-semibold text-sky-300">Happy reading!</p>
      </section>

      {/* Organisation */}
      <section id="organisation" className="mb-12">
        <h3 className="text-xl font-semibold mb-4 text-white border-b border-white/10 pb-1">Organisation</h3>
        <p className="mb-4">
          In this application, there are currently <strong>3</strong> different methods that you can utilise to organise your books.
        </p>
        <p className="mb-4">
          The inspiration is from a library shelf. <strong>Shelves</strong> represent genres, <strong>Collections</strong> represent series and <strong>Tags</strong> are well ....tags.
        </p>
        <p className="mb-4">
          You are not obligated to follow this analogy strictly, but it provides a useful framework.
        </p>
        <p className="mb-4">
          The <strong>Library</strong> page will by default have one shelf <code className="bg-white/10 px-1.5 py-0.5 rounded text-sm">Default</code> and within it one collection <code className="bg-white/10 px-1.5 py-0.5 rounded text-sm">Default</code>.
        </p>
        <p className="mb-4">
          <strong>Shelves</strong> and <strong>Collections</strong> can be created in the <strong>Library</strong> page using the <strong>Add Collection</strong> button per shelf to create a collection within the <strong>same</strong> shelf, and the <strong>Create New Shelf</strong> button at the bottom of the page to create a new <strong>empty</strong> shelf.
        </p>

        <DocumentationImage src="./docs/organisation/library_create_new.png" alt="Create new shelf and collection buttons" />

        <p className="mb-4">On clicking, a dialog will prompt you to enter a name for the new shelf or collection.</p>
        <DocumentationImage src="./docs/organisation/library_page_create_dialog.png" alt="Create new collection dialog" />

        <p className="mb-4">
          Other ways to create <strong>Shelves</strong> and <strong>Collections</strong> are during upload in the <strong>Upload</strong> page and on a <a href="#book-details" onClick={(e) => handleLinkClick(e, "book-details")} className="text-sky-400 hover:underline"><strong>book details</strong></a> edit.
        </p>
        <p className="mb-4">
          When selecting a shelf or a collection, you can choose from existing ones using the dialog menu. Alternatively, typing a <em>new name</em> will automatically create it for you.
        </p>

        <DocumentationImage src="./docs/organisation/upload_page_collection_dialog.png" alt="Select collection dialog" />

        <ul className="space-y-4 mb-6">
          <li>
            <p className="mb-2">
              Each <strong>shelf</strong> can hold multiple <strong>collections</strong>. You can rename or delete a shelf using the buttons highlighted below.
            </p>
            <DocumentationImage src="./docs/organisation/library_page_shelf.png" alt="Edit and rename shelf buttons" />
          </li>
          <li>
            <p className="mb-2">
              Each <strong>collection</strong> can contain multiple books. You can rename or delete a collection using the buttons highlighted below.
            </p>
            <DocumentationImage src="./docs/organisation/collection_page_buttons.png" alt="Edit and rename collection buttons" />

            <Alert type="important">
              <p>
                Deleting a shelf or a collection will <strong><em>remove</em></strong> <strong>all</strong> books contained within it from your <strong>library</strong> and <strong><em>not your drive</em></strong>.
              </p>
            </Alert>
          </li>
        </ul>

        <p className="mb-4"><strong>Tags</strong> are <em>labels</em> that can be attached to books individually.</p>
        <p className="mb-4">
          Tags are flexible labels you can attach to individual books. They are useful for identifying themes and content, which helps with searching and filtering on the <strong>Search</strong> page. See <a href="#search-and-filter" onClick={(e) => handleLinkClick(e, "search-and-filter")} className="text-sky-400 hover:underline">Search &amp; Filter</a> for more information.
        </p>
        <p className="mb-4">
          Similar to <strong>shelves</strong> and <strong>collections</strong>, <strong>tags</strong> can be added from the <strong>Upload</strong> page or the <a href="#book-details" onClick={(e) => handleLinkClick(e, "book-details")} className="text-sky-400 hover:underline"><strong>book details</strong></a>.
        </p>
        <p className="mb-4 flex items-center gap-1">
          To create a <strong>tag</strong>, type its name into the field and click the <Plus size={15} /> (plus) button.
        </p>
        <p className="mb-4">
          If a tag is already created previously for other books, it will show in the tag box where you can search for it. Choosing a tag will include it in a book's attached tags.
        </p>

        <DocumentationImage src="./docs/organisation/tag_dialog.png" alt="Tag manager dialog" />

        <div id="book-details" className="pt-6">
          <p className="mb-4">
            To access a <strong>book's details</strong>, select it from a <strong>Collection</strong> page and click the <code className="bg-white/10 px-1.5 py-0.5 rounded text-sm">Edit Book</code> button in the details section, as highlighted below.
          </p>
          <DocumentationImage src="./docs/organisation/collection_details_edit.png" alt="Collection page with edit book button highlighted" />

          <p className="mb-4">
            Within the <strong>book details</strong>, you can modify the book's <em>title</em>, <em>author</em>, <em>thumbnail</em>, <strong>shelf</strong>, <strong>collection</strong> and <strong>tags</strong>.
          </p>
          <p className="mb-4">
            You can also delete the book from your library by clicking the <code className="bg-white/10 px-1.5 py-0.5 rounded text-sm">Delete this book</code> button, as shown below.
          </p>

          <Alert type="important">
            <p>Deleting a book from the library will <strong>not</strong> delete the <em>original</em> PDF file from your computer.</p>
          </Alert>

          <DocumentationImage src="./docs/organisation/book_details_delete.png" alt="Book details page with delete button zoomed in" />

          <p className="mb-4">You can replace the book's thumbnail by hovering over the current one, and clicking to upload a new image.</p>
          <DocumentationImage src="./docs/organisation/book_details_thumbnail.png" alt="Book details page with thumbnail zoomed in" />

          <p className="mb-4">
            <code className="bg-white/10 px-1.5 py-0.5 rounded text-sm">Save Changes</code> button at the bottom of the page will only appear if any change is detected to a book's details, remember to click on it to persist these changes.
          </p>
          <DocumentationImage src="./docs/organisation/book_details_add_changes.png" alt="Book details page with tag section zoomed in" />
        </div>
      </section>

      {/* Search and Filter */}
      <section id="search-and-filter" className="mb-12">
        <h3 className="text-xl font-semibold mb-4 text-white border-b border-white/10 pb-1">Search and Filter</h3>
        <p className="mb-4">
          You can navigate to the <strong>Search</strong> page using the <code className="bg-white/10 px-1.5 py-0.5 rounded text-sm">Search</code> <strong>side menu</strong> button. Then you are directed to a page as shown below.
        </p>

        <DocumentationImage src="./docs/search/search_page.png" alt="Search page" />

        <p className="mb-4">
          All books that have been uploaded are shown here. Clicking on a book result will redirect you to the <strong>View</strong> page to start reading.
        </p>

        <h4 className="text-lg font-semibold mb-3 text-white">Using Filters</h4>
        <p className="mb-4">Use the search filters to narrow down the results and find a specific book or a group of similar books.</p>

        <ul className="space-y-6">
          <li>
            <strong className="text-white block mb-1">Search Bar</strong>
            <p className="mb-2">Use this to find books by their <strong>title</strong> or <strong><em>author</em></strong>.</p>
            <DocumentationImage src="./docs/search/search_page_bar.png" alt="Search filters - search bar" />
          </li>

          <li>
            <strong className="text-white block mb-1">Shelf filter</strong>
            <p className="mb-2">Use this to show only the books belonging to a specific shelf. You can select from your existing shelves.</p>
            <DocumentationImage src="./docs/search/search_filter_shelf.png" alt="Search filters - shelf filter" />
          </li>

          <li>
            <strong className="text-white block mb-1">Collection filter</strong>
            <p className="mb-2">Use this to show only the books belonging to a specific collection. You can select from your existing collections.</p>
            <p className="mb-4">
              Selecting a collection first will <strong>automatically select</strong> the shelf it belongs to, and selecting a shelf will <strong>limit</strong> the collections that you can filter to only the ones within it.
            </p>
          </li>

          <li>
            <strong className="text-white block mb-1">Tag filter</strong>
            <p className="mb-2">
              Use this to show only books that contain <strong>all</strong> of the selected tags. You can select one or more tags from your existing list.
            </p>
            <DocumentationImage src="./docs/search/search_filter_tags.png" alt="Search filters - tag filter" />
          </li>
        </ul>

        <p className="mt-4">You can apply any combination of these filters to refine your search. Only apply the filters you need to find your books.</p>
      </section>

      {/* Settings */}
      <section id="settings" className="mb-12">
        <h3 className="text-xl font-semibold mb-4 text-white border-b border-white/10 pb-1">Settings</h3>

        <Alert type="info">
          <p>The number of adjustable settings is currently limited, but more options are planned for future updates.</p>
        </Alert>

        <p className="mb-4">
          You can navigate to the <strong>Settings</strong> page using the <code className="bg-white/10 px-1.5 py-0.5 rounded text-sm">Settings</code> <strong>side menu</strong> button.
        </p>
        <p className="mb-4">
          The first section you encounter is the <strong>Interface Themes</strong>, which offers a range of themes to alter the application's color pallete.
        </p>

        <DocumentationImage src="./docs/settings/settings_page_themes.png" alt="Interface settings section" />

        <p className="mb-2">Choosing one of the themes will change the application's pallete for your <strong><em>current</em></strong> session.</p>
        <p className="mb-4">To persist a theme, you must save your changes.</p>

        <p className="mb-4">
          The section shown below is the <strong>Application Preferences</strong>, which give control over application-wide changes.
        </p>

        <DocumentationImage src="./docs/settings/settings_page_application.png" alt="Application settings section" />

        <p className="mb-2">The following settings are available:</p>
        <ul className="space-y-4 mb-6 list-disc list-inside">
          <li>
            <code className="bg-white/10 px-1.5 py-0.5 rounded text-sm font-mono">Save Last Viewed Pages</code>
            <p className="pl-6 text-sm mt-1">
              When <strong><em>toggled</em></strong> on, the application will remember the last page you were viewing in a book. When you reopen that book, it will automatically return to that page.
            </p>
          </li>
          <li>
            <code className="bg-white/10 px-1.5 py-0.5 rounded text-sm font-mono">Load Recent Book</code>
            <p className="pl-6 text-sm mt-1 mb-2">
              When <strong><em>toggled</em></strong> on, the <strong>Library</strong> page will display a section with your most recently viewed book, allowing you to quickly resume reading.
            </p>
            <DocumentationImage src="./docs/settings/last_viewed_page.png" alt="Last viewed page section" />
          </li>
          <li>
            <code className="bg-white/10 px-1.5 py-0.5 rounded text-sm font-mono">Generate Thumbnails</code>
            <p className="pl-6 text-sm mt-1">
              When <strong><em>toggled</em></strong> on, a <em>thumbnail</em>, a screenshot of the first page, will be automatically generated for every book you upload.
            </p>
          </li>
        </ul>

        <p className="mb-4">The section shown below is the <strong>Search Preferences</strong>, which give control over search page settings.</p>

        <DocumentationImage src="./docs/settings/settings_page_search.png" alt="Search settings section" />

        <p className="mb-2">The following settings are available:</p>
        <ul className="space-y-4 mb-6 list-disc list-inside">
          <li>
            <code className="bg-white/10 px-1.5 py-0.5 rounded text-sm font-mono">Sort Order</code>
            <p className="pl-6 text-sm mt-1">
              When <strong><em>toggled</em></strong> on, the search page results will automatically default to either <strong>ascending</strong> or <strong>descending</strong> order when displaying results.
            </p>
          </li>
          <li>
            <code className="bg-white/10 px-1.5 py-0.5 rounded text-sm font-mono">Default View Layout</code>
            <p className="pl-6 text-sm mt-1">
              Choose between <strong><em>List</em></strong> and <strong><em>Grid</em></strong> to change the search results view layout. Grid view shows thumbnails of each book in the results, but List view does not.
            </p>
          </li>
          <li>
            <code className="bg-white/10 px-1.5 py-0.5 rounded text-sm font-mono">Books Per Page</code>
            <p className="pl-6 text-sm mt-1">
              Default <code className="bg-white/10 px-1 py-0.5 rounded text-xs">12</code>. Set the number of books <strong>per result page</strong> in the search page.
            </p>
          </li>
        </ul>

        <p className="mb-2">At the top of the page, you will find two buttons:</p>
        <ul className="list-disc list-inside mb-4 space-y-1">
          <li><code className="bg-white/10 px-1.5 py-0.5 rounded text-sm">Reset to Default</code> reverts all settings to their original values.</li>
          <li><code className="bg-white/10 px-1.5 py-0.5 rounded text-sm">Save</code> saves any new changes you have made.</li>
        </ul>

        <DocumentationImage src="./docs/settings/settings_page_save.png" alt="Save settings section" />
      </section>

      {/* Batch Mode */}
      <section id="batch-mode" className="mb-12">
        <h3 className="text-xl font-semibold mb-4 text-white border-b border-white/10 pb-1 flex items-center justify-between">
          <span>Batch Mode</span>
          <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded font-mono">EXPERIMENTAL</span>
        </h3>

        <Alert type="important">
          <p className="mb-1">
            This mode <strong>heavily consumes memory</strong> as of 28/7/2026, and computers with low RAM memory should avoid using this mode with folders of high file count.
          </p>
          <p className="font-semibold text-xs mt-2">Recommended batch size: &lt;= 30 PDF files</p>
        </Alert>

        <p className="mb-4">
          Using <strong>Batch mode</strong> during upload allows you to upload a folder containing multiple books at the same time.
        </p>
        <p className="mb-2">A book's title is determined by its filename:</p>

        <ul className="list-disc list-inside space-y-2 mb-4">
          <li>
            <strong>Detected Patterns</strong>: If a PDF filename includes words like Chapter, Volume, Page, Section or similar shortcuts then the book title appends the folder name <strong><em>prior</em></strong> to the filename
          </li>
          <li>
            <strong>Unique Names</strong>: If a PDF filename is <em>unique</em> then it is left as is
          </li>
        </ul>

        <p className="mb-2">If a batch included this folder:</p>
        <pre className="bg-black/40 border border-white/10 p-3 rounded-lg text-sm font-mono text-emerald-400 mb-4 overflow-x-auto">
{`Series
|
|__ Chapter 1
|
|__ Chapter 2`}
        </pre>

        <p className="mb-4">
          Then the books' titles in this batch would become: <code className="bg-white/10 px-1.5 py-0.5 rounded text-sm">Series - Chapter 1</code> and <code className="bg-white/10 px-1.5 py-0.5 rounded text-sm">Series - Chapter 2</code>
        </p>

        <p className="mb-4">
          This feature aids in the hassle of having to rename multiple files manually or uploading them individually using <strong>Single Mode</strong>.
        </p>
        <p className="mb-4">You can manually edit any book's title and author from a batch should it need modification.</p>

        <p className="mb-4">
          <strong>Collection</strong>, <strong>Shelf</strong>, <strong>Tags</strong>, and <strong>Book View</strong> are all common and applied to <strong><em>all books</em></strong> within a batch.
        </p>

        <DocumentationImage src="./docs/organisation/batch_mode.png" alt="Batch Mode results" />
      
        <p className="text-white">
          Congrats on reaching the end of the documentation (if you actually read this far)!
        </p>
        <p className="text-white pb-12">
          Be sure to know that any changes that would occur in the application will be documented here for future use.
        </p>

        <p className="text-center text-white/50 pb-12">Happy reading!</p>
      </section>
    </div>
  );
}