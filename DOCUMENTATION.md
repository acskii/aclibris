## Documentation

### Introduction

Thanks for installing Aclibris!

I hope this application will prove useful and entertaining in some way or another, because it was just as fun developing it as using during its testing period.

This documentation provides the basic instructions you need to take full advantage of all the application's features.

### Table of Contents
- [Introduction](#introduction)
- [Adding your first book](#adding-your-first-book)
- [Book Types](#book-types)
- [Smooth read](#smooth-read)
- [Organisation](#organisation)
- [Search & Filter](#search-and-filter)
- [Settings](#settings)
- [Batch Mode](#batch-mode) **[EXPERIMENTAL]**

#### Adding your first book

When you start the application, you will see the **Library** page.

To upload your first book, you can either click on the `Upload Book` button on the _right_ side of the welcome header, or you can navigate to the same page using the `Upload Book` **side menu** button.

![Library page with highlights on 2 buttons](./public/docs/first_book/library_page_upload_highlighted.png)

Once the **Upload** page is loaded, you will see a section at the top of the page where you can upload your first book.

> [!IMPORTANT]
>
> All files that you upload can **_only_** be **.pdf** files

There are two ways to upload books onto the application:

- **Single Mode**

- **Batch Mode** (See at [Batch Mode](#batch-mode))

We will focus on _single_ mode for this section.

You can see on the _left_ side of this section a **Drag and Drop** section.

You can drag and drop your book file directly into this section. Alternatively, clicking on the section will open the _File Explorer_, allowing you to select the file from your computer.

![Upload page with highlight on single mode upload section](./public/docs/first_book/upload_page_single_highlighted.png)

On successful upload, the section will turn _green_ and display an option to remove the file if you wish to replace it.

![Upload section with highlight on remove button](./public/docs/first_book/upload_page_success_remove.png)

Once the upload is complete, two new sections will appear below: **_File Information_** and **_Organisation_**.

In the File Information section, **6** fields will show basic information that we already saved within the uploaded PDF's metadata, including:

- Title: _Can be edited_
- Author: _Can be edited_
- Pages: _Read only_
- File Size: _Read only_
- Creation date: _Read only_ 

The final field is the **thumbnail**, which is a screenshot of the first page of your PDF. You can disable this feature from the **Settings** page.

Check out [Setting up preferences]() for more information.

![File Information section with highlight on editable fields](./public/docs/first_book/upload_page_success_information.png)

In the Organisation section, set the **Collection** as `Default` for now.

You can change how a book is viewed when reading by modifying the **Choose Book View** option. See the options and their differences at the [Book Types](#book-types) section.

As this is a tutorial for adding your first book, advanced organisation is not necessary. However, organisation is a _significant_ feature within the application.

You can learn more about organisation methods from the [Organisation](#organisation) section. 

![Organisation section](./public/docs/first_book/upload_page_success_organisation.png)

Click on `Save Book` to save your first book!

Now to read your first book, you can access it through the **Library** page. 

After saving, you will be automatically redirected to the **Library** page. You can also navigate there at any time using the `Library` **side menu** button.

You should see a `Default` **shelf** containing a `Default` **collection**. Click on the collection to open it.

![Library page with default collection hightlighted](./public/docs/first_book/library_page_collection_highlighted.png)

This is the **Collection** page, which displays all books stored within the collection you selected.

Here you can select a book to read, and its details will show on the _left-hand_ side of the screen (or at the _top_, depending on your window resolution).

![Collection page](./public/docs/first_book/collection_page.png)

The book details section shows all the information saved from the **Upload** page, along with **2** buttons: `Read This Book` and `Edit Book`.

Click on the `Read This Book` button to read your first book!

![Book details section](./public/docs/first_book/collection_page_book_details.png)

You can now upload more books and know where to read them.

It is recommended to learn more about organising your books in the [Organisation](#organisation) section, 
or go to the next section [Book Types](#book-types) to learn more about available book views.

#### Book Types

There are currently _two_ views a book can be set to change the reading experience in the **View** page:

- **One page**

    This is the standard book view which uses the **_page by page_** render that only views **one page** at a time.

    Navigation is done using the page control within the **View** page.

    Zoom in/out is supported in this mode. 

    ![View page with one page view](./public/docs/book_types/one_page.png)

- **Vertical Strip**

    This is the _webtoon_ view which uses the **_panels by scroll_** render that treats each page within the book as a long stripe **panel** and only views the panel based on the position of your scroll.

    This mode enforces the _standard webtoon width_ for a panel of **800px** to prevent inconsistencies while scrolling.

    Page navigation is not supported since panels are viewed by scrolling.

    Zoom in/out is supported in this mode.

    ![View page with vertical strip view](./public/docs/book_types/vertical_strip.png)


You can change how a book is viewed right when you upload it using the **Choose Book View** option in the **Upload** page.

![Book View option in Upload page](./public/docs/book_types/upload_page_book_view.png)

You can find the same option within the **Book Details** page if you ever need to change the view option you set up on upload.

![Book View option in Book Details page](./public/docs/book_types/book_details_book_view.png)

For more information on reading, go to the next section [Smooth read](#smooth-read) to learn more about the features available on the **View** page.

#### Smooth read

Aftering opening a book, you are directed to the **View** page, the heart of the application.

![View page](./public/docs/smooth_read/view_page.png)

Above the page preview, you can see several controls for navigating and adjusting the content.

On the far left is the `Collection` <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-layers-icon lucide-layers"><path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"/><path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"/><path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"/></svg> button, which  returns you to the **Collection** page that contains the opened book. You can consider it as the exit button of the page.

On the far right are the **page controls**, where you can navigate the book you are currently viewing.

![Page controls with page controls highlighted](./public/docs/smooth_read/preview_controls_page_controls.png)

Here are the control functions in order, assume a book has _n_ total pages and you are currently viewing page _c_ :

- Turn to **First** <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevrons-left-icon lucide-chevrons-left"><path d="m11 17-5-5 5-5"/><path d="m18 17-5-5 5-5"/></svg>

    Jumps to **page 1**.

- Turn to **Previous** <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-left-icon lucide-chevron-left"><path d="m15 18-6-6 6-6"/></svg>

    Goes to the previous page, **page _c_ - 1** ( _c_ > 1 ) of the book.

- Page Count ( _c_ / _n_ )

    You can click on the highlighted area to edit the page number directly. The number must be between **1** and _n_.

    ![Page count highlighted](./public/docs/smooth_read/page_count_highlighted.png)

- Turn to **Next** <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right-icon lucide-chevron-right"><path d="m9 18 6-6-6-6"/></svg>

    Advances to the next page, **page _c_ + 1** ( _c_ < _n_ ) of the book.

- Turn to **Last** <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevrons-right-icon lucide-chevrons-right"><path d="m6 17 5-5-5-5"/><path d="m13 17 5-5-5-5"/></svg>

   Jumps to the **last page** (page _n_).

There is also a **zoom** in and out feature, which you can controls using the buttons highlighted.

![Preview controls with zoom highlighted](./public/docs/smooth_read/preview_controls_zoom.png)

- The minimum zoom is **50%** and the maximum is **200%**.

- Click the <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus-icon lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg> (plus) button to zoom in.

- Click the <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-minus-icon lucide-minus"><path d="M5 12h14"/></svg> (minus) button to zoom out.

These are all the current features on the **View** page, more are expected to come.

Happy reading!

#### Organisation

In this application, there are currently **3** different methods that you can utilise to organise your books.

The inspiration is from a library shelf. **Shelves** represent genres, **Collections** represent series and **Tags** are well ....tags.

You are not obligated to follow this analogy strictly, but it provides a useful framework.

The **Library** page will by default have one shelf `Default` and within it one collection `Default`.

**Shelves** and **Collections** can be created in the **Library** page using the **Add Collection** button per shelf to create a collection within the **same** shelf, and the **Create New Shelf** button at the bottom of the page to create a new **empty** shelf.

![Create new shelf and collection buttons](./public/docs/organisation/library_create_new.png)

On clicking, a dialog will prompt you to enter a name for the new shelf or collection.

![Create new collection dialog](./public/docs/organisation/library_page_create_dialog.png)

Other ways to create **Shelves** and **Collections** are during upload in the **Upload** page and on a [**book details**](#book-details) edit. 

When selecting a shelf or a collection, you can choose from existing ones using the dialog menu. Alternatively, typing a _new name_ will automatically create it for you.

![Select collection dialog](./public/docs/organisation/upload_page_collection_dialog.png)

- Each **shelf** can hold multiple **collections**. You can rename or delete a shelf using the buttons highlighted below.

    ![Edit and rename shelf buttons](./public/docs/organisation/library_page_shelf.png)

- Each **collection** can contain multiple books. You can rename or delete a collection using the buttons highlighted below.

    ![Edit and rename collection buttons](./public/docs/organisation/collection_page_buttons.png)

    > [!IMPORTANT]
    >
    > Deleting a shelf or a collection will **_remove_** **all** books contained within it from your **library** and **_not your drive_**.


**Tags** are _labels_ that can be attached to books individually.

Tags are flexible labels you can attach to individual books. They are useful for identifying themes and content, which helps with searching and filtering on the **Search** page. See [Search & Filter](#search-and-filter) for more information.

Similar to **shelves** and **collections**, **tags** can be added from the **Upload** page or the [**book details**](#book-details). 

To create a **tag**, type its name into the field and click the <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus-icon lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg> (plus) button.

If a tag is already created previously for other books, it will show in the tag box where you can search for it.
Choosing a tag will include it in a book's attached tags.

![Tag manager dialog](./public/docs/organisation/tag_dialog.png)

<a id="book-details"></a>

To access a **book's details**, select it from a **Collection** page and click the `Edit Book` button in the details section, as highlighted below.

![Collection page with edit book button highlighted](./public/docs/organisation/collection_details_edit.png)

Within the **book details**, you can modify the book's _title_, _author_, _thumbnail_, **shelf**, **collection** and **tags**. 

You can also delete the book from your library by clicking the `Delete this book` button, as shown below.

> [!IMPORTANT]
> 
> Deleting a book from the library will **not** delete the _original_ PDF file from your computer.

![Book details page with delete button zoomed in](./public/docs/organisation/book_details_delete.png)

You can replace the book's thumbnail by hovering over the current one, and clicking to upload a new image.

![Book details page with thumbnail zoomed in](./public/docs/organisation/book_details_thumbnail.png)

`Save Changes` button at the bottom of the page will only appear if any change is detected to a book's details, remember to click on it to persist these changes.

![Book details page with tag section zoomed in](./public/docs/organisation/book_details_add_changes.png)

#### Search and Filter

You can navigate to the **Search** page using the `Search` **side menu** button. Then you are directed to a page as shown below.

![Search page](./public/docs/search/search_page.png)

All books that have been uploaded are shown here. Clicking on a book result will redirect you to the **View** page to start reading.

**Using Filters**

Use the search filters to narrow down the results and find a specific book or a group of similar books.

- Search Bar

    Use this to find books by their **title** or **_author_**. 

    ![Search filters - search bar](./public/docs/search/search_page_bar.png)

- **Shelf** filter 

    Use this to show only the books belonging to a specific shelf. You can select from your existing shelves.

    ![Search filters - shelf filter](./public/docs/search/search_filter_shelf.png)

- **Collection** filter

    Use this to show only the books belonging to a specific collection. You can select from your existing collections.

Selecting a collection first will **automatically select** the shelf it belongs to, and selecting a shelf will **limit** the collections that you can filter to only the ones within it.

- **Tag** filter 
    
    Use this to show only books that contain **all** of the selected tags. You can select one or more tags from your existing list.

    ![Search filters - tag filter](./public/docs/search/search_filter_tags.png)

You can apply any combination of these filters to refine your search. Only apply the filters you need to find your books.

#### Settings

> [!NOTE]
> 
> The number of adjustable settings is currently limited, but more options are planned for future updates.

You can navigate to the **Settings** page using the `Settings` **side menu** button.

The first section you encounter is the **Interface Themes**, which offers a range of themes to alter the application's color pallete.

![Interface settings section](./public/docs/settings/settings_page_themes.png)

Choosing one of the themes will change the application's pallete for your **_current_** session.

To persist a theme, you must save your changes.

The section shown below is the **Application Preferences**, which give control over application-wide changes.

![Application settings section](./public/docs/settings/settings_page_application.png)

The following settings are available:

- `Save Last Viewed Pages`

    When **_toggled_** on, the application will remember the last page you were viewing in a book. When you reopen that book, it will automatically return to that page.

- `Load Recent Book`
    
    When **_toggled_** on, the **Library** page will display a section with your most recently viewed book, allowing you to quickly resume reading.

    ![Last viewed page section](./public/docs/settings/last_viewed_page.png)

- `Generate Thumbnails`     
    
    When **_toggled_** on, a _thumbnail_, a screenshot of the first page, will be automatically generated for every book you upload.

The section shown below is the **Search Preferences**, which give control over search page settings.

![Search settings section](./public/docs/settings/settings_page_search.png)

The following settings are available:

- `Sort Order`

    When **_toggled_** on, the search page results will automatically default to either **ascending** or **descending** order when displaying results.

- `Default View Layout`
    
    Choose between **_List_** and **_Grid_** to change the search results view layout.
    Grid view shows thumbnails of each book in the results, but List view does not.

- `Books Per Page`     
    
    Default `12`. Set the number of books  **per result page** in the search page.

At the top of the page, you will find two buttons:
- `Reset to Default` reverts all settings to their original values.
- `Save` saves any new changes you have made.

![Save settings section](./public/docs/settings/settings_page_save.png)


#### Batch Mode

> [!WARNING]
>
> This mode **heavily consumes memory** as of 28/7/2026, and computers with low RAM memory should avoid using this mode with folders of high file count
>
> Recommended batch size: <= **30 PDF files**

Using **Batch mode** during upload allows you to upload a folder containing multiple books at the same time.

A book's title is determined by its filename:

- **Detected Patterns**: If a PDF filename includes words like Chapter, Volume, Page, Section or similar shortcuts then the book title appends the folder name **_prior_** to the filename

- **Unique Names**: If a PDF filename is _unique_ then it is left as is

If a batch included this folder:
```txt
Series
|
|__ Chapter 1
|
|__ Chapter 2
```
Then the books' titles in this batch would become: `Series - Chapter 1` and `Series - Chapter 2`

This feature aids in the hassle of having to rename multiple files manually or uploading them individually using **Single Mode**.

You can manually edit any book's title and author from a batch should it need modification.

**Collection**, **Shelf**, **Tags**, and **Book View** are all common and applied to **_all books_** within a batch.

![Batch Mode results](./public/docs/organisation/batch_mode.png)