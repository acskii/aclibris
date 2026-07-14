import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BookObject } from "../../electron/database/objects/Book";
import { Spinner } from "../components/Spinner";
import {
  ArrowLeft,
  FileText,
  Library,
  PenBox,
  Save,
  Trash2,
  TriangleAlert,
  Upload,
} from "lucide-react";
import { arrayToBase64 } from "../service/util/Thumbnail";
import { formatFileSize } from "../service/util/FileSize";
import { fromUnix } from "../service/util/Date";
import { CollectionObject } from "../../electron/database/objects/Collection";
import { ShelfObject } from "../../electron/database/objects/Shelf";
import DeleteDialog from "../components/common/dialog/DeleteDialog";
import SocialLayout from "../layouts/SocialLayout";
import ChooseDialog, { type DialogOption } from "../components/common/dialog/ChooseDialog";
import TagDialog from "../components/common/dialog/TagDialog";
import { TagObject } from "../../electron/database/objects/Tag";

export default function BookDetailsPage() {
  const params = useParams();
  const navigate = useNavigate();
  const id = params.id ? parseInt(params.id) : null;

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [saving, setSaving] = useState<boolean>(false);
  const [deleted, setDeleted] = useState<boolean>(false);
  const [meta, setMeta] = useState<Partial<BookObject>>({});

  const [shelves, setShelves] = useState<DialogOption[]>([]);
  const [shelfSelect, setShelfSelect] = useState<boolean>(false);
  const [shelfName, setShelfName] = useState<string>("Select a Shelf");

  const [collections, setCollections] = useState<CollectionObject[]>([]);
  const [collectionSelect, setCollectionSelect] = useState<boolean>(false);
  const [collectionName, setCollectionName] = useState<string>("Select a Collection");

  const [tags, setTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagSelect, setTagSelect] = useState<boolean>(false);

  const [collectOptions, setCollectOptions] = useState<DialogOption[]>([]);
  const [selectedShelf, setSelectedShelf] = useState<DialogOption | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<CollectionObject | null>(null);
  const [collectionInput, setCollectionInput] = useState<string>("");
  const [shelfInput, setShelfInput] = useState<string>("");

  const loadData = async () => {
    try {
      if (!id) return;

      setLoading(true);
      const response1: BookObject = await window.db.book.get(id);
      setMeta(response1);
      setSelectedTags(response1.tags.map((t) => t.name));

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
      const collection = response2.find((c) => c.id == response1.collectionId) ?? null;
      setSelectedCollection(collection);
      setCollectionInput(collection ? collection.name : "");
      setCollectionName(collection ? collection.name : "");
      setCollectOptions(collectionOptions);

      const response3: ShelfObject[] = await window.db.shelf.getAll();
      const s = response3.map((shelf) => ({ id: shelf.id, name: shelf.name }));
      setShelves(s);

      const response4: TagObject[] = await window.db.tag.getAll();
      setTags(response4.map((tag) => tag.name));        // Save only tag names

      const shelf = collection ? (response3.find((s) => s.id == collection.shelfId) ?? null) : null;
      setSelectedShelf(shelf);
      setShelfInput(shelf ? shelf.name : "");
      setShelfName(shelf ? shelf.name : "");
    } catch (error: any) {
      setMeta({});
      setShelves([]);
      setTags([]);
      setSelectedTags([]);
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
        selectedTags,
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

  const handleTagSelect = (tag: string) => {
    setSelectedTags([...selectedTags, tag]);
  };

  const handleTagRemove = (tag: string) => {
    if (tag.length == 0) return;

    const currentTags = selectedTags.filter(t => t !== tag);
    setSelectedTags(currentTags);
  };

  const handleMetaChange = (
    field: keyof BookObject,
    value: BookObject[keyof BookObject],
  ) => {
    if (meta) {
      setMeta({
        ...meta,
        [field]: value,
      });
    }
  };

  const handleThumbnailUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.files && event.target.files.length == 1) {
      const file = event.target.files[0];
      const array = await file.arrayBuffer().then((buffer) => {
        return new Uint8Array(buffer);
      });
      handleMetaChange("thumbnail", array);
    }
  };

  const handleCollectionSelect = (collection: DialogOption | null) => {
    if (!collection) {
      setCollectionInput("");
      setSelectedCollection(null);
      setSelectedShelf(null);
      setShelfInput("");
      setShelfName("Select a Shelf");
      setCollectionName("Select a Collection");
      setCollectOptions(collections);
    } else {
      const c = collections.find((cc) => cc.id === collection.id);
      setSelectedCollection(c ? c : null);
      setCollectionInput(c ? c.name : "");
      setCollectionName(c ? c.name : "Select a Collection");
      if (c) {
        const s = shelves.find((ss) => ss.id === c.shelfId);
        if (s) {
          setSelectedShelf(s);
          setShelfInput(s.name);
          setShelfName(s.name);
          setCollectOptions(
            collections
              .filter((c) => c.shelfId === s.id)
              .map((collection) => ({
                id: collection.id,
                name: collection.name,
              })),
          );
        } else {
          setSelectedShelf(null);
          setShelfInput("");
          setShelfName("Select a Shelf");
        }
      }
    }

    /* Close dialog on selection */
    setCollectionSelect(false);
  };

  const handleShelfSelect = (shelf: DialogOption | null) => {
    setSelectedShelf(shelf);

    if (shelf) {
      setShelfInput(shelf.name);
      setShelfName(shelf.name);
      setCollectionName("Select a Collection");
      setSelectedCollection(null);
      setCollectOptions(
        collections
          .filter((c) => c.shelfId === shelf.id)
          .map((collection) => ({
            id: collection.id,
            name: collection.name,
          })),
      );
    } else {
      setSelectedCollection(null);
      setShelfInput("");
      setShelfName("Select a Shelf");
      setCollectionName("Select a Collection");
      setCollectionInput("");
      setCollectOptions(
        collections.map((collection) => ({
          id: collection.id,
          name: collection.name,
        })),
      );
    }

    /* Close dialog on selection */
    setShelfSelect(false);
  };

  const handleDelete = async () => {
    if (deleted) {
      // @ts-ignore
      await window.db.book.delete(meta.id);
      goBack();
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  return (
    <SocialLayout>
      {loading && (
        <div className="flex items-center justify-center w-full">
          <Spinner />
        </div>
      )}

      {error != "" && (
        <div
          className="bg-red-600 mb-10 z-50 w-full rounded-xl"
          role="alert"
          aria-labelledby="toast-error"
        >
          <div className="flex p-4 items-center">
            <div className="shrink-0 text-white">
              <TriangleAlert size={30} />
            </div>
            <div className="ms-3">
              <p className="text-md text-white font-bold ">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="w-full px-6 py-4 min-w-0">
        {/* Dialog for shelf selection */}
        <ChooseDialog
          isOpen={shelfSelect}
          options={shelves}
          item="Shelf"
          selected={selectedShelf ? selectedShelf.id : null}
          onOptionSelect={handleShelfSelect}
          onClose={() => setShelfSelect(false)}
        />

        {/* Dialog for collection selection */}
        <ChooseDialog
          isOpen={collectionSelect}
          options={collectOptions}
          item="Collection"
          selected={selectedCollection ? selectedCollection.id : null}
          onOptionSelect={handleCollectionSelect}
          onClose={() => setCollectionSelect(false)}
        />

        {/* Dialog for tag selection & creation */}
        <TagDialog 
          isOpen={tagSelect}
          onClose={() => setTagSelect(false)}
          availableTags={tags}
          selectedTags={selectedTags}
          onSelectTag={handleTagSelect}
          onRemoveTag={handleTagRemove}
          onCreateTag={handleTagSelect}
          onClearAll={() => {
            selectedTags.forEach(handleTagRemove);                         
            setTagSelect(false);
          }}
        />
      </div>

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
          className="flex flex-row items-center gap-2 mb-2 cursor-pointer font-semibold text-xl hover:text-stop-1 transition-colors text-white"
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
            className="flex flex-row items-center justify-center gap-2 w-full bg-red-600 hover:bg-red-700 p-2 rounded-md font-bold text-sm cursor-pointer transition-colors duration-200 text-white"
            onClick={() => setDeleted(true)}
          >
            <Trash2 size={18} /> Delete this book
          </button>
          <div className="flex flex-col bg-gray-800/30 items-start justify-center rounded-md p-4 gap-2">
            <h3 className="font-semibold text-white text-nowrap underline decoration-stop-1">
              Title
            </h3>
            <input
              type="text"
              className="border border-2 rounded-md p-2 w-full border-white/20 focus:border-stop-1 bg-white/10 text-white"
              value={meta.title}
              onChange={(e) => handleMetaChange("title", e.target.value)}
              placeholder="Enter book title"
            />
          </div>
          <div className="flex flex-col bg-gray-800/30 items-start justify-center rounded-md p-4 gap-2">
            <h3 className="font-semibold text-white text-nowrap underline decoration-stop-1">
              Author
            </h3>
            <input
              type="text"
              className="border border-2 rounded-md p-2 w-full border-white/20 focus:border-stop-1 bg-white/10 text-white"
              value={meta.author}
              onChange={(e) => handleMetaChange("author", e.target.value)}
              placeholder="Enter author name"
            />
          </div>
          <div className="flex flex-col bg-gray-800/30 items-start justify-center rounded-md p-4 gap-2">
            <h3 className="font-semibold text-white text-nowrap underline decoration-stop-1">
              Pages
            </h3>
            <input
              type="number"
              className="border border-2 rounded-md p-2 w-full border-white/20 focus:border-stop-1 bg-black/20 text-white"
              value={meta.pages}
              disabled={true}
            />
          </div>
          <div className="flex flex-col bg-gray-800/30 items-start justify-center rounded-md p-4 gap-2">
            <h3 className="font-semibold text-white text-nowrap underline decoration-stop-1">
              Last Viewed Page
            </h3>
            <input
              type="text"
              className="border border-2 rounded-md p-2 w-full border-white/20 focus:border-stop-1 bg-black/20 text-white"
              value={meta.lastReadPage == 1 ? "N/A" : meta.lastReadPage}
              disabled={true}
            />
          </div>
          <div className="flex flex-col bg-gray-800/30 items-start justify-center rounded-md p-4 gap-2">
            <h3 className="font-semibold text-white text-nowrap underline decoration-stop-1">
              Last Viewed At
            </h3>
            <input
              type="string"
              className="border border-2 rounded-md p-2 w-full border-white/20 focus:border-stop-1 bg-black/20 text-white"
              value={
                meta.lastVisitedInUnix
                  ? fromUnix(meta.lastVisitedInUnix)
                  : "N/A"
              }
              disabled={true}
            />
          </div>
          <div className="flex flex-col bg-gray-800/30 items-start justify-center rounded-md p-4 gap-2">
            <h3 className="font-semibold text-white text-nowrap underline decoration-stop-1">
              File Size
            </h3>
            <input
              type="text"
              className="border border-2 rounded-md p-2 w-full border-white/20 focus:border-stop-1 bg-black/20 text-white"
              value={meta.fileSize ? formatFileSize(meta.fileSize) : "N/A"}
              disabled={true}
            />
          </div>
          <div className="flex flex-col bg-gray-800/30 items-start justify-center rounded-md p-4 gap-2">
            <h3 className="font-semibold text-white text-nowrap underline decoration-stop-1">
              Created At
            </h3>
            <input
              type="text"
              className="border border-2 rounded-md p-2 w-full border-white/20 focus:border-stop-1 bg-black/20 text-white"
              value={
                meta.createdAtInUnix ? fromUnix(meta.createdAtInUnix) : "N/A"
              }
              disabled={true}
            />
          </div>
          <div className="flex flex-col bg-gray-800/30 items-start justify-center rounded-md p-4 gap-2">
            <h3 className="font-semibold text-stop-3 text-nowrap underline decoration-stop-3">
              File Path
            </h3>
            <input
              type="text"
              disabled={true}
              className="border border-2 rounded-md p-2 w-full border-white/20 focus:border-stop-1 bg-black/20 text-white"
              value={meta.filePath || ""}
              onChange={(e) => handleMetaChange("filePath", e.target.value)}
              placeholder="Enter file path"
            />
          </div>
        </div>

        <div className="bg-gray-800/30 rounded-md p-6 border border-white/20 relative overflow-hidden">
          <h3 className="font-semibold text-white text-nowrap underline decoration-stop-1 mb-4">
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
              <div className="w-full h-full bg-white/5 rounded-md flex flex-col gap-2 items-center justify-center border-2 border-dashed border-white/20">
                <FileText size={40} className="text-white/40" />
                <span className="text-sm text-center text-white/40">
                  No thumbnail available
                </span>
              </div>
            )}

            <div className="absolute inset-0 bg-black/50 opacity-0 border-dashed group-hover:border-2 border-stop-1 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
              <label className="flex flex-col gap-2 items-center justify-center w-full h-full cursor-pointer text-white">
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

      <div className="bg-gray-800/30 items-start justify-center w-full rounded-md p-4 gap-2 mb-4">
        <span className="text-md text-white mb-6 flex justify-start items-center gap-2 font-bold">
          <Library className="w-5 h-5" />
          Book Records
        </span>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Collection Selection */}
          <button
            onClick={() => setCollectionSelect(true)}
            className="text-nowrap  py-1 px-2 flex-1 cursor-pointer bg-app-card border border-1 border-white/40 rounded-md text-white font-semibold placeholder-white/50 focus:border-3 focus:outline-none text-base"
            title="Collection"
          >
            {collectionName}
          </button>

          <button
            onClick={() => setShelfSelect(true)}
            className="text-nowrap  py-1 px-2 flex-1 cursor-pointer bg-app-card border border-1 border-white/40 rounded-md text-white font-semibold placeholder-white/50 focus:border-3 focus:outline-none text-base"
            title="Shelf"
          >
            {shelfName}
          </button>
        </div>

        <div className="border-t border-white/5 pt-3">
          <span className="text-md text-white mb-6 flex justify-start items-center gap-2 font-bold">
            Tags 
            <button
              onClick={() => setTagSelect(true)}
              className="text-nowrap grow-0 py-1 px-2 flex-1 cursor-pointer bg-app-card border border-1 border-white/40 rounded-md text-white font-semibold placeholder-white/50 focus:border-3 focus:outline-none text-base"
            >
              Edit Tags
            </button>
          </span>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto no-scrollbar py-0.5">
            {selectedTags.length > 0 && selectedTags.map((tag) => (
              <span
                key={tag}
                className="bg-stop-3 text-white font-semibold px-2 py-0.5 rounded-md text-sm flex items-center gap-1.5"
              >
                {tag}
              </span>
            ))}
            {selectedTags.length == 0 && (
              <span className="text-sm text-white font-semibold">No Tags Attached</span>  
            )}
          </div>
        </div>
      </div>

      {!loading && meta && (
        <div className="flex justify-end">
          <button
            onClick={saveBook}
            disabled={saving}
            className="bg-stop-1 cursor-pointer hover:opacity-90 disabled:opacity-50 text-white px-4 py-1 rounded-md transition-colors flex items-center gap-2"
          >
            {saving ? (
              <>
                <Spinner />
                Saving...
              </>
            ) : (
              <>
                <Save size={20} />
                Add Changes
              </>
            )}
          </button>
        </div>
      )}
    </SocialLayout>
  );
}
