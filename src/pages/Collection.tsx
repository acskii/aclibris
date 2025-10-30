import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Book,
  Library,
  FileText,
  Calendar,
  User,
  Hash,
  Eye,
  PenBox,
} from "lucide-react";
import { Spinner } from "../components/common/spinner/Spinner";
import { CollectionObject } from "../../electron/database/objects/Collection";
import { BookObject } from "../../electron/database/objects/Book";
import { fromUnix } from "../service/util/Date";
import { formatFileSize } from "../service/util/FileSize";
import { arrayToBase64 } from "../service/util/Thumbnail";
import { EditNameDialog } from "../components/common/dialog/EditNameDialog";

export function CollectionPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [collection, setCollection] = useState<CollectionObject>();
  const [books, setBooks] = useState<BookObject[]>([]);
  const [selectedBook, setSelectedBook] = useState<BookObject | null>(null);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const goBack = () => {
    navigate("/library");
  };

  const loadData = async () => {
      try {
        setLoading(true);

        if (!id) {
          setError("No collection ID was provided, please reload the page..");
          return;
        }

        // Load the collection from the database
        const response1: CollectionObject = await window.db.collection.get(id);
        if (!response1) {
          setError("No collection of this ID exists, please choose another..");
          return;
        }
        setCollection(response1);

        // Load all books related to the collection
        const response2: BookObject[] = await window.db.book.getByCollection(id);
        setBooks(response2);
      } catch (error: any) {
        setError(error.message);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadData();
  }, []);

  const handleBookClick = (book: BookObject) => {
    setSelectedBook(book);
  };

  const handleReadBook = (book: BookObject) => {
    navigate(`/view/${book.id}/${book.lastReadPage ?? 1}`);
  };

  const handleEdit = async (new_name: string) => {
    if (edit && collection) {
      await window.db.collection.updateName(collection.id, new_name);
      setEdit(false);
      loadData();
    }
  }

  return (
    <div className="min-h-screen p-6">
      {loading && (
        <div className="flex bg-indigo-400 p-3 rounded-md flex-row items-center justify-center gap-2 z-30 my-10">
          <Spinner />
          <p className="text-violet-900 font-bold text-center text-md">
            Loading..
          </p>
        </div>
      )}

      {error && (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-violet-900 flex items-center justify-center">
          <div className="text-center">
            <Library className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <p className="text-red-300 text-lg mb-4">
              {error || "Collection not found"}
            </p>
            <button
              type="button"
              onClick={goBack}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md transition-colors"
            >
              Back to Library
            </button>
          </div>
        </div>
      )}

      <EditNameDialog
        isOpen={edit}
        onClose={() => setEdit(false)}
        onSave={handleEdit}
        title="Edit Collection Name"
        currentName={collection ? collection.name : "N/A"}
        placeholder="Enter new collection name..."
      />

      <div className="flex flex-col gap-2 mb-8">
        <button
          type="button"
          onClick={goBack}
          className="flex flex-row items-center gap-2 mb-2 cursor-pointer font-semibold text-xl hover:text-violet-800 transition-colors"
        >
          <ArrowLeft size={25} />
          Back
        </button>

        <div className="flex flex-row items-center gap-4">
          <h1 className="text-4xl font-bold text-white flex items-center gap-2">
            <Book size={40} />
            {collection ? collection.name : "N/A"}
          </h1>

          {collection && (
            <div className="relative group">
              <button
                className="bg-sky-600 hover:bg-blue-700 p-2 rounded-md font-bold text-sm cursor-pointer transition-colors duration-200"
                onClick={() => setEdit(true)}
              >
                <PenBox size={18} />
              </button>

              {/* Hover Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-blue-600 text-white font-semibold text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                Edit Name
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Selected Book Preview */}
        <div className="xl:col-span-1">
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-md p-6 border border-indigo-500/20 sticky top-6">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
              <FileText size={30} />
              Details
            </h2>

            {selectedBook ? (
              <div className="space-y-4">
                <div>
                  {selectedBook.thumbnail ? (
                    <img
                      src={`data:image/jpeg;base64,${arrayToBase64(
                        selectedBook.thumbnail
                      )}`}
                      alt="Book cover thumbnail"
                      className="w-full h-full object-contain rounded-md"
                    />
                  ) : (
                    <div className="w-full h-full bg-indigo-900/30 rounded-md flex flex-col gap-2 items-center justify-center border-2 border-dashed border-indigo-500/50">
                      <FileText size={40} />
                      <span className="text-sm text-center">
                        No thumbnail available
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-white font-semibold text-xl mb-2">
                    {selectedBook.title || "Untitled"}
                  </h3>
                  {selectedBook.author && (
                    <p className="text-indigo-200 text-lg mb-3">
                      by {selectedBook.author}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-indigo-500/20">
                    <span className="text-indigo-200">Pages</span>
                    <span className="text-white font-semibold">
                      {selectedBook.pages}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-indigo-500/20">
                    <span className="text-indigo-200">File Size</span>
                    <span className="text-white font-semibold">
                      {formatFileSize(selectedBook.fileSize)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-indigo-500/20">
                    <span className="text-indigo-200">Created at</span>
                    <span className="text-white font-semibold">
                      {fromUnix(selectedBook.createdAtInUnix)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleReadBook(selectedBook)}
                  className="w-full cursor-pointer bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white py-3 rounded-md transition-all transform flex items-center justify-center gap-2 font-semibold"
                >
                  <Eye size={18} />
                  Read This Book
                </button>
                <button
                  // TODO
                  onClick={() => console.log("click edit")}
                  className="w-full cursor-pointer bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-md transition-all transform flex items-center justify-center gap-2 font-semibold"
                >
                  <PenBox size={18} />
                  Edit Details
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText size={70} className="mx-auto mb-4" />
                <p className="font-bold">Select a book to view details</p>
                <p className="text-white/50">
                  Click on any book in the list to see its information here
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Books List */}
        <div className="lg:col-span-2">
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-md p-6 border border-indigo-500/20">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
              <Library size={30} />
              All Books ({books.length})
            </h2>

            {books.length === 0 ? (
              <div className="text-center py-12">
                <Book className="w-16 h-16 text-indigo-400/50 mx-auto mb-4" />
                <p className="text-indigo-200 text-lg">
                  No books in this collection yet
                </p>
                <p className="text-indigo-300/70 mt-2">
                  Add books from the upload page
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-90 overflow-y-auto lg:max-h-full">
                {books.map((book: BookObject) => {
                  return (
                    <div
                      key={book.id}
                      className={`bg-gray-700/30 rounded-md p-4 border transition-all cursor-pointer hover:bg-violet-700/60 ${
                        selectedBook?.id === book.id
                          ? "border-indigo-400 bg-indigo-900/60"
                          : "border-indigo-500/20 hover:border-indigo-400/50"
                      }`}
                      onClick={() => handleBookClick(book)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-white font-semibold text-lg mb-1 line-clamp-1">
                            {book.title || "Untitled"}
                          </h3>
                          {book.author && (
                            <p className="text-indigo-200 text-sm mb-2 flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {book.author}
                            </p>
                          )}
                          <div className="flex items-center gap-4 text-indigo-300/70 text-xs">
                            <span className="flex items-center gap-1">
                              <FileText className="w-3 h-3" />
                              {formatFileSize(book.fileSize)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Hash className="w-3 h-3" />
                              {book.pages} pages
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {fromUnix(book.createdAtInUnix)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
