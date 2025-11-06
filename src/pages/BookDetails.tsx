import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BookObject } from "../../electron/database/objects/Book";
import { Spinner } from "../components/common/spinner/Spinner";
import {
  ArrowLeft,
  FileText,
  PenBox,
  Save,
  Trash2,
  TriangleAlert,
  Upload,
} from "lucide-react";
import { arrayToBase64 } from "../service/util/Thumbnail";
import { formatFileSize } from "../service/util/FileSize";
import { fromUnix } from "../service/util/Date";
import {
  AutocompleteDropdown,
  DropdownOption,
} from "../components/common/dropdown/AutocompleteDropdown";
import { CollectionObject } from "../../electron/database/objects/Collection";
import { ShelfObject } from "../../electron/database/objects/Shelf";
import DeleteDialog from "../components/common/dialog/DeleteDialog";
import { TagManager } from "../components/common/TagManager";

export default function BookDetailsPage() {
  const params = useParams();
  const navigate = useNavigate();
  const id = params.id ? parseInt(params.id) : null;

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [saving, setSaving] = useState<boolean>(false);
  const [deleted, setDeleted] = useState<boolean>(false);
  const [meta, setMeta] = useState<Partial<BookObject>>({});

  const [shelves, setShelves] = useState<DropdownOption[]>([]);
  const [collections, setCollections] = useState<CollectionObject[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [collectOptions, setCollectOptions] = useState<DropdownOption[]>([]);
  const [selectedShelf, setSelectedShelf] = useState<DropdownOption | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<CollectionObject | null>(null);
  const [collectionInput, setCollectionInput] = useState<string>("");
  const [shelfInput, setShelfInput] = useState<string>("");

  const loadData = async () => {
    try {
      if (!id) return;

      setLoading(true);
      // @ts-ignore
      const response1: BookObject = await window.db.book.get(id);
      setMeta(response1);
      setTags(response1.tags.map((t) => t.name));

      // @ts-ignore
      const response2: CollectionObject[] = await window.db.collection.getAll();
      const collectionOptions = response2.map((collection) => ({
        id: collection.id,
        name: collection.name,
      }));
      setCollections(response2);
      // Used instead of using state due to stale state/race condition
      // - apparently setting a state and attempting to use it right after has no
      //   guarentee that the state has been set, hence the need to use extra variables
      //   to complete loading of initial selected organisations
      const collection =
        response2.find((c) => c.id == response1.collectionId) ?? null;
      setSelectedCollection(collection);
      setCollectionInput(collection ? collection.name : "");
      setCollectOptions(collectionOptions);

      // @ts-ignore
      const response3: ShelfObject[] = await window.db.shelf.getAll();
      const s = response3.map((shelf) => ({ id: shelf.id, name: shelf.name }));
      setShelves(s);

      const shelf = collection
        ? response3.find((s) => s.id == collection.shelfId) ?? null
        : null;
      setSelectedShelf(shelf);
      setShelfInput(shelf ? shelf.name : "");
    } catch (error: any) {
      setMeta({});
      setShelves([]);
      setTags([]);
      setCollectOptions([]);
      setCollections([]);
      setSelectedCollection(null);
      setSelectedShelf(null);
      setCollectionInput("");
      setShelfInput("");
    } finally {
      setLoading(false);
    }
  };

  const saveBook = async () => {
    if (meta) {
      setSaving(true);

      // @ts-ignore
      const error = await window.db.book.update(meta.id, 
        meta.title ? meta.title : "N/A",
        meta.author ? meta.author : "N/A",
        selectedCollection ? selectedCollection.name : collectionInput, 
        selectedShelf ? selectedShelf.name : shelfInput,
        meta.thumbnail,
        tags
      );
      setSaving(false);

      if (error) {
        setError(error);
      } else {
        goBack();
      }
    }
  };

  const goBack = () => {
    if (meta) navigate(`/collection/${meta.collectionId}`);
    else navigate("/library");
  };

  const handleTagChange = (tags: string[]) => {
    setTags(tags);
  }

  const handleMetaChange = (
    field: keyof BookObject,
    value: BookObject[keyof BookObject]
  ) => {
    if (meta) {
      setMeta({
        ...meta,
        [field]: value,
      });
    }
  };

  const handleThumbnailUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length == 1) {
      const file = event.target.files[0];
      const array = await file.arrayBuffer().then((buffer) => {
        return new Uint8Array(buffer);
      });
      handleMetaChange("thumbnail", array);
    }
  };

  const handleCollectionInputChange = (value: string) => {
    setCollectionInput(value);
    setSelectedCollection(null);
  };

  const handleCollectionSelect = (collection: DropdownOption | null) => {
    if (!collection) {
      setCollectionInput("");
      setSelectedCollection(null);
      setSelectedShelf(null);
      setShelfInput("");
      setCollectOptions(collections);
    } else {
      const c = collections.find((cc) => cc.id === collection.id);
      setSelectedCollection(c ? c : null);
      if (c) {
        const s = shelves.find((ss) => ss.id === c.shelfId);
        setSelectedShelf(s ? s : null);
        setShelfInput(s ? s.name : "");
      }
    }
  };

  const handleShelfInputChange = (value: string) => {
    setShelfInput(value);
    setSelectedCollection(null);
    setSelectedShelf(null);
    setCollectOptions([]);
  };

  const handleShelfSelect = (shelf: DropdownOption | null) => {
    setSelectedShelf(shelf);
    if (shelf) setShelfInput(shelf.name);

    if (!shelf) {
      setSelectedCollection(null);
      setShelfInput("");
      setCollectionInput("");
      setCollectOptions(
        collections.map((collection) => ({
          id: collection.id,
          name: collection.name,
        }))
      );
    }

    if (shelf && !selectedCollection) {
      setCollectOptions(
        collections
          .filter((c) => c.shelfId === shelf.id)
          .map((collection) => ({
            id: collection.id,
            name: collection.name,
          }))
      );
    }
  };

  const handleDelete = async () => {
    if (deleted) {
      // @ts-ignore
      await window.db.book.delete(meta.id);
      goBack();
    }
  }

  useEffect(() => {
    loadData();
  }, [id]);

  return (
    <div className="min-h-screen flex flex-col p-5">
      {loading && (
        <div className="flex bg-indigo-400 p-3 rounded-lg flex-row items-center justify-center gap-2 z-30 my-10">
          <Spinner />
          <p className="text-violet-900 font-bold text-center text-md">
            Loading..
          </p>
        </div>
      )}
      {error != "" && (
        <div
          className="bg-gradient-to-l from-orange-400 to-yellow-300 mb-10 z-50 w-full rounded-xl"
          role="alert"
          aria-labelledby="toast-error"
        >
          <div className="flex p-4 items-center">
            <div className="shrink-0 text-red-500">
              <TriangleAlert size={30} />
            </div>
            <div className="ms-3">
              <p className="text-md text-red-400 font-bold ">{error}</p>
            </div>
          </div>
        </div>
      )}

      <DeleteDialog
        isOpen={deleted}
        onClose={() => setDeleted(false)}
        onConfirm={handleDelete}
        title="Delete Book"
        message={`Are you sure you want to delete this book "${meta.title}"?`}
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
        <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
          <PenBox size={40} />
          Book Details
        </h1>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="space-y-4">
          <button
            className="flex flex-row items-center justify-center gap-2 w-full bg-red-600 hover:bg-red-700 p-2 rounded-md font-bold text-sm cursor-pointer transition-colors duration-200"
            onClick={() => setDeleted(true)}
          >
            <Trash2 size={18} /> Delete this book
          </button>
          <div className="flex flex-col bg-indigo-800/20 items-start justify-center rounded-md p-4 gap-2">
            <h3 className="font-semibold text-white text-nowrap underline decoration-cyan-400">
              Title
            </h3>
            <input
              type="text"
              className="border border-2 rounded-md p-2 w-full border-cyan-400/60 focus:border-violet-800/60 bg-white/10 text-white"
              value={meta.title}
              onChange={(e) => handleMetaChange("title", e.target.value)}
              placeholder="Enter book title"
            />
          </div>
          <div className="flex flex-col bg-indigo-800/20 items-start justify-center rounded-md p-4 gap-2">
            <h3 className="font-semibold text-white text-nowrap underline decoration-cyan-400">
              Author
            </h3>
            <input
              type="text"
              className="border border-2 rounded-md p-2 w-full border-cyan-400/60 focus:border-violet-800/60 bg-white/10 text-white"
              value={meta.author}
              onChange={(e) => handleMetaChange("author", e.target.value)}
              placeholder="Enter author name"
            />
          </div>
          <div className="flex flex-col bg-indigo-800/20 items-start justify-center rounded-md p-4 gap-2">
            <h3 className="font-semibold text-white text-nowrap underline decoration-cyan-400">
              Pages
            </h3>
            <input
              type="number"
              className="border border-2 rounded-md p-2 w-full border-cyan-400/60 focus:border-violet-800/60 bg-gray-600/50 text-white"
              value={meta.pages}
              disabled={true}
            />
          </div>
          <div className="flex flex-col bg-indigo-800/20 items-start justify-center rounded-md p-4 gap-2">
            <h3 className="font-semibold text-white text-nowrap underline decoration-cyan-400">
              Last Viewed Page
            </h3>
            <input
              type="text"
              className="border border-2 rounded-md p-2 w-full border-cyan-400/60 focus:border-violet-800/60 bg-gray-600/50 text-white"
              value={meta.lastReadPage == 1 ? "N/A" : meta.lastReadPage}
              disabled={true}
            />
          </div>
          <div className="flex flex-col bg-indigo-800/20 items-start justify-center rounded-md p-4 gap-2">
            <h3 className="font-semibold text-white text-nowrap underline decoration-cyan-400">
              Last Viewed At
            </h3>
            <input
              type="string"
              className="border border-2 rounded-md p-2 w-full border-cyan-400/60 focus:border-violet-800/60 bg-gray-600/50 text-white"
              value={
                meta.lastVisitedInUnix
                  ? fromUnix(meta.lastVisitedInUnix)
                  : "N/A"
              }
              disabled={true}
            />
          </div>
          <div className="flex flex-col bg-indigo-800/20 items-start justify-center rounded-md p-4 gap-2">
            <h3 className="font-semibold text-white text-nowrap underline decoration-cyan-400">
              File Size
            </h3>
            <input
              type="text"
              className="border border-2 rounded-md p-2 w-full border-cyan-400/60 focus:border-violet-800/60 bg-gray-600/50 text-white"
              value={meta.fileSize ? formatFileSize(meta.fileSize) : "N/A"}
              disabled={true}
            />
          </div>
          <div className="flex flex-col bg-indigo-800/20 items-start justify-center rounded-md p-4 gap-2">
            <h3 className="font-semibold text-white text-nowrap underline decoration-cyan-400">
              Created At
            </h3>
            <input
              type="text"
              className="border border-2 rounded-md p-2 w-full border-cyan-400/60 focus:border-violet-800/60 bg-gray-600/50 text-white"
              value={
                meta.createdAtInUnix ? fromUnix(meta.createdAtInUnix) : "N/A"
              }
              disabled={true}
            />
          </div>
          {/* TODO */}
          <div className="flex flex-col bg-indigo-800/20 items-start justify-center rounded-md p-4 gap-2">
            <h3 className="font-semibold text-orange-600 text-nowrap underline decoration-red-400">
              File Path
            </h3>
            <input
              type="text"
              className="border border-2 rounded-md p-2 w-full border-cyan-400/60 focus:border-violet-800/60 bg-white/10 text-white"
              value={meta.filePath || ""}
              onChange={(e) => handleMetaChange("filePath", e.target.value)}
              placeholder="Enter file path"
            />
          </div>
        </div>

        <div className="bg-indigo-800/20 rounded-md p-6 order border-indigo-500/30 relative overflow-hidden">
            <h3 className="font-semibold text-white text-nowrap underline decoration-cyan-400 mb-4">
                Thumbnail
            </h3>
            <div className="absolute inset-16 group flex items-center justify-center overflow-hidden">
            {meta.thumbnail ? (
                <img
                src={`data:image/jpeg;base64,${arrayToBase64(meta.thumbnail)}`}
                alt="Book cover thumbnail"
                className="h-full w-auto max-w-full object-contain rounded-md"
                />
            ) : (
                <div className="w-full h-full bg-indigo-900/30 rounded-md flex flex-col gap-2 items-center justify-center border-2 border-dashed border-indigo-500/50">
                <FileText size={40} />
                <span className="text-sm text-center">No thumbnail available</span>
                </div>
            )}

            <div className="absolute inset-0 bg-black/50 opacity-0 border-dashed group-hover:border-2 border-cyan-400 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <label className="flex flex-col gap-2 items-center justify-center w-full h-full cursor-pointer">
                <Upload className="max-w-30" />
                <span className="text-[1.2cqw]">Upload New</span>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailUpload}
                    className="hidden"
                />
                </label>
            </div>
            </div>
        </div>
      </div>

      <div className="bg-indigo-800/20 items-start justify-center w-full rounded-md p-4 gap-2 mb-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Collection Selection */}
          <div>
            <AutocompleteDropdown
              title="Collection"
              placeholder="Select a collection"
              options={collectOptions}
              value={collectionInput}
              onValueChange={handleCollectionInputChange}
              onOptionSelect={handleCollectionSelect}
            />
            {!selectedCollection && collectionInput && <span className="mt-2 text-cyan-300 font-semibold text-md">This collection will be created</span>}
          </div>
          {/* Shelf Selection */}
          <div>
            <AutocompleteDropdown
              title="Shelf"
              placeholder="Select a shelf"
              options={shelves}
              value={shelfInput}
              onValueChange={handleShelfInputChange}
              onOptionSelect={handleShelfSelect}
            />
            {!selectedShelf && shelfInput && <span className="mt-2 text-cyan-300 font-semibold text-md">This shelf will be created</span>}
          </div>
        </div>
        <TagManager 
          currentTags={tags}
          onTagsChange={handleTagChange}
        />
      </div>

      {!loading && meta && (
        <div className="flex justify-end">
          <button
            onClick={saveBook}
            disabled={saving}
            className="bg-green-600 cursor-pointer hover:bg-green-700 disabled:bg-green-800 text-white px-4 py-1 rounded-md transition-colors flex items-center gap-2"
          >
            {saving ? (
              <>
                <Spinner />
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                Add Changes
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
