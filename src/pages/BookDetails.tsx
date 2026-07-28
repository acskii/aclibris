import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BookObject, ViewType } from "../../electron/database/objects/Book";
import { Spinner } from "../components/Spinner";
import {
  ArrowLeft,
  FileText,
  Library,
  PenBox,
  Save,
  Trash2,
  Upload,
  Tag as TagIcon,
  FolderOpen,
  Layers,
  Sparkles,
  RectangleVertical,
  Book,
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
import { useToast } from "../contexts/ToastContext";

export default function BookDetailsPage() {
  const params = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const id = params.id ? parseInt(params.id) : null;

  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [deleted, setDeleted] = useState<boolean>(false);
  const [meta, setMeta] = useState<Partial<BookObject>>({});

  // Original state tracking for conditional save button
  const [initialState, setInitialState] = useState<{
    title: string;
    author: string;
    collectionId: number | null;
    shelfId: number | null;
    tags: string[];
    thumbnail: Uint8Array | null;
    view: ViewType;
  }>({
    title: "",
    author: "",
    collectionId: null,
    shelfId: null,
    tags: [],
    thumbnail: null,
    view: "horizontal",
  });

  const [shelves, setShelves] = useState<DialogOption[]>([]);
  const [shelfSelect, setShelfSelect] = useState<boolean>(false);
  const [shelfName, setShelfName] = useState<string>("Select a Shelf");

  const [collections, setCollections] = useState<CollectionObject[]>([]);
  const [collectionSelect, setCollectionSelect] = useState<boolean>(false);
  const [collectionName, setCollectionName] = useState<string>("Select a Collection");

  const [tags, setTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagSelect, setTagSelect] = useState<boolean>(false);

  const [view, setView] = useState<ViewType>('horizontal');

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
      setView(response1.view);
      const loadedTags = response1.tags ? response1.tags.map((t) => t.name) : [];
      setSelectedTags(loadedTags);

      const response2: CollectionObject[] = await window.db.collection.getAll();
      const collectionOptions = response2.map((collection) => ({
        id: collection.id,
        name: collection.name,
      }));
      setCollections(response2);

      const collection = response2.find((c) => c.id === response1.collectionId) ?? null;
      setSelectedCollection(collection);
      setCollectionInput(collection ? collection.name : "");
      setCollectionName(collection ? collection.name : "Select a Collection");
      setCollectOptions(collectionOptions);

      const response3: ShelfObject[] = await window.db.shelf.getAll();
      const s = response3.map((shelf) => ({ id: shelf.id, name: shelf.name }));
      setShelves(s);

      const response4: TagObject[] = await window.db.tag.getAll();
      setTags(response4.map((tag) => tag.name));

      const shelf = collection ? (response3.find((s) => s.id === collection.shelfId) ?? null) : null;
      setSelectedShelf(shelf);
      setShelfInput(shelf ? shelf.name : "");
      setShelfName(shelf ? shelf.name : "Select a Shelf");

      // Set initial baseline state to detect changes
      setInitialState({
        title: response1.title || "",
        author: response1.author || "",
        collectionId: collection ? collection.id : null,
        shelfId: shelf ? shelf.id : null,
        tags: loadedTags,
        thumbnail: response1.thumbnail || null,
        view: response1.view,
      });

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

  // Determine if any changeable fields have been modified
  const isDirty = useMemo(() => {
    if (!meta) return false;

    const titleChanged = (meta.title || "") !== initialState.title;
    const authorChanged = (meta.author || "") !== initialState.author;
    const shelfChanged = (selectedShelf?.id ?? null) !== initialState.shelfId;
    const collectionChanged = (selectedCollection?.id ?? null) !== initialState.collectionId;
    const thumbnailChanged = meta.thumbnail !== initialState.thumbnail;
    const viewChanged = view !== initialState.view;

    const tagsChanged =
      selectedTags.length !== initialState.tags.length ||
      selectedTags.some((t, i) => t !== initialState.tags[i]);

    return titleChanged || authorChanged || shelfChanged || collectionChanged || thumbnailChanged || viewChanged || tagsChanged;
  }, [meta, selectedShelf, selectedCollection, selectedTags, view, initialState]);

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
        view,
        selectedTags,
      );
      setSaving(false);

      if (error) {
        showToast(error, "error");
      } else {
        goBack();
      }
    }
  };

  const goBack = () => {
    if (meta && meta.collectionId) navigate(`/collection/${meta.collectionId}`);
    else navigate("/library");
  };

  const handleTagSelect = (tag: string) => {
    setSelectedTags([...selectedTags, tag]);
  };

  const handleTagRemove = (tag: string) => {
    if (tag.length === 0) return;
    const currentTags = selectedTags.filter((t) => t !== tag);
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
    if (event.target.files && event.target.files.length === 1) {
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
        <div className="flex items-center justify-center w-full py-12">
          <Spinner />
        </div>
      )}

      <div className="w-full px-6 py-2 min-w-0">
        <ChooseDialog
          isOpen={shelfSelect}
          options={shelves}
          item="Shelf"
          selected={selectedShelf ? selectedShelf.id : null}
          onOptionSelect={handleShelfSelect}
          onClose={() => setShelfSelect(false)}
        />

        <ChooseDialog
          isOpen={collectionSelect}
          options={collectOptions}
          item="Collection"
          selected={selectedCollection ? selectedCollection.id : null}
          onOptionSelect={handleCollectionSelect}
          onClose={() => setCollectionSelect(false)}
        />

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

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex flex-col gap-1">
          <button
            type="button"
            onClick={goBack}
            className="flex flex-row items-center gap-2 mb-2 cursor-pointer font-semibold text-xl hover:text-violet-800 transition-colors"
          >
            <ArrowLeft size={20} />
            Back
          </button>

          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <PenBox size={40} />
            Book Details
          </h1>
        </div>
      </div>

      <button
        className="flex flex-row items-center justify-center gap-2 w-full bg-red-600 hover:bg-red-700 p-2 rounded-md font-bold text-sm cursor-pointer transition-colors duration-200 text-white"
        onClick={() => setDeleted(true)}
      >
        <Trash2 size={18} /> Delete this book
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-gray-800/40 border border-stop-1/30 rounded-md p-5 space-y-4 shadow-lg">
            <span className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wide">
              File Information
            </span>

            <div className="space-y-1.5">
              <h3 className="font-semibold text-white text-nowrap underline decoration-stop-1">
                Title <span className="text-stop-1">*</span>
              </h3>
              <input
                type="text"
                className="w-full border-2 border-stop-1/40 focus:border-stop-1 rounded-lg p-2.5 bg-black/40 text-white font-medium focus:outline-none transition-colors"
                value={meta.title || ""}
                onChange={(e) => handleMetaChange("title", e.target.value)}
                placeholder="Enter book title"
              />
            </div>

            <div className="space-y-1.5">
              <h3 className="font-semibold text-white text-nowrap underline decoration-stop-1">
                Author
              </h3>
              <input
                type="text"
                className="w-full border-2 border-stop-1/40 focus:border-stop-1 rounded-lg p-2.5 bg-black/40 text-white font-medium focus:outline-none transition-colors"
                value={meta.author || ""}
                onChange={(e) => handleMetaChange("author", e.target.value)}
                placeholder="Enter author name"
              />
            </div>

            <div className="space-y-1.5 flex gap-4 items-center">
              <h3 className="font-semibold text-white text-nowrap underline decoration-stop-1">
                Book View
              </h3>
              <div className="flex items-center bg-stop-3/40 p-1 rounded-md border border-white/5">
                <button
                  onClick={() => setView("horizontal")}
                  className={`p-1.5 rounded transition-all cursor-pointer ${
                    view === "horizontal"
                      ? "bg-stop-1 text-white shadow-sm"
                      : "text-white/50 hover:text-white"
                  }`}
                  title="One Page"
                >
                  <Book size={18} />
                </button>
                <button
                  onClick={() => setView("vertical")}
                  className={`p-1.5 rounded transition-all cursor-pointer ${
                    view === "vertical"
                      ? "bg-stop-1 text-white shadow-sm"
                      : "text-white/50 hover:text-white"
                  }`}
                  title="Vertical Strip"
                >
                  <RectangleVertical size={18} />
                </button>
              </div>
              <span className="flex items-center bg-stop-3/40 p-2 rounded-md border border-white/5 font-semibold">
                {`${(view === "horizontal" ? "Only one page is displayed at a time" : "No pages. Panels are viewed as you scroll.")}`}
              </span>
            </div>
          </div>

          <div className="bg-gray-800/40 border border-white/10 rounded-md p-5 space-y-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wide">
                Library Organization
              </span>
            </div>

            {/* Collection & Shelf Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <h3 className="font-semibold text-white text-nowrap underline decoration-stop-1">
                  Shelf
                </h3>
                <button
                  type="button"
                  onClick={() => setShelfSelect(true)}
                  className="w-full text-left py-2.5 px-3 cursor-pointer bg-black/30 hover:bg-black/50 border border-white/20 hover:border-stop-1/60 rounded-lg text-white font-semibold focus:outline-none transition-all truncate"
                >
                  {shelfName}
                </button>
              </div>

              <div className="space-y-1.5">
                <h3 className="font-semibold text-white text-nowrap underline decoration-stop-1">
                  Collection
                </h3>
                <button
                  type="button"
                  onClick={() => setCollectionSelect(true)}
                  className="w-full text-left py-2.5 px-3 cursor-pointer bg-black/30 hover:bg-black/50 border border-white/20 hover:border-stop-1/60 rounded-lg text-white font-semibold focus:outline-none transition-all truncate"
                >
                  {collectionName}
                </button>
              </div>
            </div>

            {/* Tags Section */}
            <div className="border-t border-white/5 pt-4 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-white text-nowrap underline decoration-stop-1">
                  Tags
                </h3>
                <button
                  type="button"
                  onClick={() => setTagSelect(true)}
                  className="text-xs px-2.5 py-1 cursor-pointer bg-stop-1/20 hover:bg-stop-1/40 border border-stop-1/40 rounded-md text-white font-semibold transition-colors"
                >
                  Edit Tags
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pt-1">
                {selectedTags.length > 0 ? (
                  selectedTags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-stop-3/90 text-white font-semibold px-2.5 py-1 rounded-md text-xs flex items-center gap-1.5 border border-white/10"
                    >
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-white/40 italic">No tags attached</span>  
                )}
              </div>
            </div>
          </div>

          <div className="bg-gray-800/20 border border-white/10 rounded-md p-5 space-y-4">
            <span className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wide">
              File Statistics
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-black/20 p-2.5 rounded-lg border border-white/5">
                <span className="block text-[10px] text-white/50 uppercase font-semibold">Total Pages</span>
                <span className="text-sm font-bold text-white">{meta.pages ?? "N/A"}</span>
              </div>

              <div className="bg-black/20 p-2.5 rounded-lg border border-white/5">
                <span className="block text-[10px] text-white/50 uppercase font-semibold">Last Page Read</span>
                <span className="text-sm font-bold text-white">
                  {meta.lastReadPage === 1 || !meta.lastReadPage ? "N/A" : `p. ${meta.lastReadPage}`}
                </span>
              </div>

              <div className="bg-black/20 p-2.5 rounded-lg border border-white/5">
                <span className="block text-[10px] text-white/50 uppercase font-semibold">File Size</span>
                <span className="text-sm font-bold text-white">
                  {meta.fileSize ? formatFileSize(meta.fileSize) : "N/A"}
                </span>
              </div>

              <div className="bg-black/20 p-2.5 rounded-lg border border-white/5">
                <span className="block text-[10px] text-white/50 uppercase font-semibold">Last Viewed</span>
                <span className="text-sm font-semibold text-white/80 truncate block">
                  {meta.lastVisitedInUnix ? fromUnix(meta.lastVisitedInUnix) : "Never"}
                </span>
              </div>

              <div className="bg-black/20 p-2.5 rounded-lg border border-white/5">
                <span className="block text-[10px] text-white/50 uppercase font-semibold">Created At</span>
                <span className="text-sm font-semibold text-white/80 truncate block">
                  {meta.createdAtInUnix ? fromUnix(meta.createdAtInUnix) : "N/A"}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-semibold text-white/50 uppercase">File Path</span>
              <input
                type="text"
                disabled
                className="w-full text-xs bg-black/40 border border-white/10 rounded-lg p-2 text-white/60 truncate cursor-not-allowed"
                value={meta.filePath || ""}
              />
            </div>
          </div>

        </div>

        <div className="lg:col-span-5 lg:sticky lg:top-6">
          <div className="bg-gray-800/40 border border-white/10 rounded-md p-5 space-y-4 shadow-md flex flex-col items-center">
            <div className="w-full flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wide">
                Thumbnail
              </span>
              <span className="text-xs text-white/50">Hover to change</span>
            </div>

            <div className="relative group w-full aspect-[3/4] max-w-xs rounded-md overflow-hidden border-2 border-dashed border-white/20 bg-black/30 flex items-center justify-center transition-all">
              {meta.thumbnail ? (
                <img
                  src={`data:image/jpeg;base64,${arrayToBase64(meta.thumbnail)}`}
                  alt="Book cover thumbnail"
                  className="h-full w-full object-contain rounded-lg p-2"
                />
              ) : (
                <div className="flex flex-col gap-2 items-center justify-center text-white/40">
                  <FileText size={48} />
                  <span className="text-xs text-center">No thumbnail available</span>
                </div>
              )}

              {/* Upload Hover Overlay */}
              <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center p-4">
                <label className="flex flex-col gap-2 items-center justify-center w-full h-full cursor-pointer text-white">
                  <Upload size={32} className="text-stop-1" />
                  <span className="text-sm font-semibold text-center">Upload New Cover</span>
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

      </div>

      {/* Save Action Bar */}
      {isDirty && !loading && (
        <div className="sticky bottom-6 z-30 flex justify-center">
          <div className="w-full bg-stop-3 border-2 border-stop-1 rounded-md p-3 px-6 flex items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-200">
            <span className="text-sm font-semibold text-white">
              Unsaved changes detected
            </span>
            <button
              onClick={saveBook}
              disabled={saving}
              className="bg-stop-1 hover:bg-stop-1/80 cursor-pointer disabled:opacity-50 text-white font-bold px-5 py-2 rounded-lg transition-colors flex items-center gap-2 shadow-md"
            >
              {saving ? (
                <>
                  <Spinner />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={18} />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </SocialLayout>
  );
}