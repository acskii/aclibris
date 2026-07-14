import FileDropArea from '../components/common/FileDropArea'
import { useNavigate } from 'react-router-dom'
import { File, FileText, Info, Library, Save, Upload } from 'lucide-react';
import { useEffect, useState } from 'react';
import { documentCache } from '../service/DocumentCache';
import { type PDFMetadata } from '../service/types/DocumentCache';
import { type ShelfObject } from '../../electron/database/objects/Shelf';
import { type CollectionObject } from '../../electron/database/objects/Collection';
import { Spinner } from '../components/Spinner';
import { formatDate, toUnix } from '../service/util/Date';
import { formatFileSize } from '../service/util/FileSize';
import { arrayToBase64 } from '../service/util/Thumbnail';
import SocialLayout from '../layouts/SocialLayout';

import { useToast } from '../contexts/ToastContext';
import CreateDialog, { DialogOption } from '../components/common/dialog/CreateDialog';
import TagDialog from '../components/common/dialog/TagDialog';
import { TagObject } from '../../electron/database/objects/Tag';


function UploadPage() {
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [file, setFile] = useState<File | null>(null);
    const [meta, setMeta] = useState<PDFMetadata | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [saving, setSaving] = useState<boolean>(false);
    const [saveError, setSaveError] = useState<string>('');
    
    /*
      INFO DUMP:
      When:
      - a collection is selected, its corresponding shelf is selected
      - a collection is typed, a shelf can be selected or typed
      - a shelf is selected, a collection can be selected or typed
      - a shelf is typed, a collection is typed
      - a collection is cleared, its corresponding shelf is cleared
      - a shelf is cleared, a selected collections is cleared
    */

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
    const [collectionInput, setCollectionInput] = useState<string>('');
    const [shelfInput, setShelfInput] = useState<string>('');

    useEffect(() => {
      const loadShelves = async () => {
        try {
          const response: ShelfObject[] = await window.db.shelf.getAll();
          const s = response.map((shelf) => ({id: shelf.id, name: shelf.name}))

          setShelves(s);
        } catch (error: any) {
          console.error(`[client:upload] => Error occurred while loading shelves for select: ${error.message}`);
          showToast(error.message, 'error');
          setShelves([]);
        }
      }

      const loadCollections = async () => {
        try {
          const response: CollectionObject[] = await window.db.collection.getAll();
          const collectionOptions = response.map(collection => ({ 
            id: collection.id, 
            name: collection.name 
          }));
          setCollections(response);
          setCollectOptions(collectionOptions);
        } catch (error: any) {
          console.error(`[client:upload] => Error occurred while loading collections for select: ${error.message}`);
          showToast(error.message, 'error');
          setCollections([]);
          setCollectOptions([]);
        }
      }

      const loadTags = async () => {
        try {
          const response: TagObject[] = await window.db.tag.getAll();
          setTags(response.map((tag) => tag.name));        // Save only tag names
        } catch (error: any) {
          console.error(`[client:upload] => Error occurred while loading tags for select: ${error.message}`);
          showToast(error.message, 'error');
          setTags([]);
        }
      }

      loadShelves();
      loadCollections();
      loadTags();
    }, [])

    const saveBook = async () => {
      if (file && meta) {
        setSaving(true);
        const cn = selectedCollection ? selectedCollection.name : collectionInput;
        const sn = selectedShelf ? selectedShelf.name : shelfInput;

        let data: any = {
          ...meta,
          tags: selectedTags
        }
        if (meta.title == null) data.title = "N/A";
        if (meta.author == null) data.author = "N/A";
        if (meta.creationdate) data.createdAt = toUnix(meta.creationdate);

        // TODO: validation for metadata
        
        const error = await window.db.book.add(file.path, data, cn, sn);
        setSaving(false);

        if (error) {
          console.error(`[client:upload] => Error occurred while saving book: ${error}`);
          setSaveError(error);
        } else {
          navigate('/');
        }
      }
    }

    const handleTagSelect = (tag: string) => {
      setSelectedTags([...selectedTags, tag]);
    };

    const handleTagRemove = (tag: string) => {
      if (tag.length == 0) return;

      const currentTags = selectedTags.filter(t => t !== tag);
      setSelectedTags(currentTags);
    };

    const handleMetaChange = (field: keyof PDFMetadata, value: string) => {
      // Change meta data based on user change
      if (meta) {
        setMeta({
          ...meta,
          [field]: value
        });
      }
    };

    const handleFile = async (file: File | null) => {
      setFile(file);
      if (file) {
        setLoading(true);
        const data = await documentCache.getMetadata(file.path);
        setMeta(data);
        setLoading(false);
      } else {
        setMeta(null);
      }
    }

    const handleCollectionCreate = (item: string | null) => {
      if (!item) {
        setCollectionInput('');
        setCollectionName("Select a Collection");
      } else {
        setCollectionInput(item);
        setCollectionName(item);
      }

      setCollectionSelect(false);
    }

    const handleShelfCreate = (item: string | null) => {
      if (!item) {
        setShelfInput('');
        setShelfName("Select a Shelf");
      } else {
        setShelfInput(item);
        setShelfName(item);
      }

      setShelfSelect(false);
    }

    const handleCollectionSelect = (collection: DialogOption | null) => {
      if (!collection) {
        setCollectionInput('');
        setSelectedCollection(null);
        setSelectedShelf(null);
        setShelfInput('');
        setShelfName("Select a Shelf");
        setCollectionName("Select a Collection");
        setCollectOptions(collections);
      } else {
        const c = collections.find((cc) => cc.id === collection.id);
        setSelectedCollection(c ? c : null);
        setCollectionInput(c ? c.name : '');
        setCollectionName(c ? c.name : "Select a Collection");
        if (c) {
          const s = shelves.find((ss) => ss.id === c.shelfId);
          if (s) {
            setSelectedShelf(s);
            setShelfInput(s.name);
            setShelfName(s.name);
            setCollectOptions(
              collections.filter((c) => c.shelfId === s.id).map(collection => ({ 
                id: collection.id, 
                name: collection.name 
              }))
            );
          } else {
            setSelectedShelf(null);
            setShelfInput('');
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
          collections.filter((c) => c.shelfId === shelf.id).map(collection => ({ 
            id: collection.id, 
            name: collection.name 
          }))
        );
      } else {
        setSelectedCollection(null);
        setShelfInput('');
        setShelfName("Select a Shelf");
        setCollectionName("Select a Collection");
        setCollectionInput('');
        setCollectOptions(collections.map(collection => ({ 
            id: collection.id, 
            name: collection.name 
        })));
      }

      /* Close dialog on selection */
      setShelfSelect(false);
    };

    return (
      <SocialLayout>
        <div className="w-full space-y-4">
          <div className="w-full px-6 py-4 min-w-0">
            {/* Dialog for shelf selection */}
            <CreateDialog 
              isOpen={shelfSelect}
              options={shelves}
              item="Shelf"
              selected={selectedShelf ? selectedShelf.id : null}
              onOptionSelect={handleShelfSelect}
              onCreate={handleShelfCreate}
              onClose={() => setShelfSelect(false)}
            />

            {/* Dialog for collection selection */}
            <CreateDialog 
              isOpen={collectionSelect}
              options={collectOptions}
              item="Collection"
              selected={selectedCollection ? selectedCollection.id : null}
              onOptionSelect={handleCollectionSelect}
              onCreate={handleCollectionCreate}
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

          <div className="mb-8 flex flex-col items-start">
            <h1 className="mb-2 flex gap-3 justify-start items-center">
              <Upload size={40} className="text-white" />
              <span className="text-4xl font-bold text-white">Upload Book</span>
            </h1>
            <p className="text-white/80 font-medium">
              Add new books to your library
            </p>
          </div>  
          
          <div className="flex flex-col bg-gray-800/30 backdrop-blur-sm rounded-md p-6">
            <span className="text-md text-white mb-6 flex justify-start">Drag and drop, or click below to upload a PDF file to be saved as a book in your library</span>
            <div className="flex flex-row gap-2">
              <div className="grow-1">
                <FileDropArea onFileSelect={handleFile} />
              </div>
              <div className="grow-1 bg-stop-1/40 rounded-md p-4 flex justify-center lg:justify-start items-center">
                <div className="flex flex-col lg:flex-row items-start gap-3 max-w-full">
                  <div className="flex flex-row gap-1">
                    <Info size={20} className="text-white/70 mt-0.5 flex-shrink-0" />
                    <h3 className="font-semibold text-white text-nowrap">File Requirements:</h3>
                  </div>
                  <div className="flex items-center justify-center text-left">
                    <ul className="text-white/80 text-sm">
                      <li>• Only .pdf files are supported</li>
                      <li>• Files should not be password protected</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div> 
          </div>

          {loading && (
            <div className="flex items-center justify-center w-full">
              <Spinner />
            </div>
          )}

          {meta && (
            <div className="flex flex-col bg-app-card backdrop-blur-sm rounded-md p-6 border border-white/20">
              <span className="text-md text-white mb-6 flex justify-start items-center gap-2 font-bold">
                <File className="w-5 h-5" />
                File Information
              </span>
    
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div className="flex flex-col bg-white/5 items-start justify-center rounded-md p-4 gap-2 border border-white/10">
                    <h3 className="font-semibold text-white text-nowrap underline decoration-stop-1">Title</h3>
                    <input 
                      type="text"
                      className="border-2 rounded-md p-2 w-full border-white/20 focus:border-stop-1 bg-white/10 text-white outline-none transition-colors"
                      value={meta.title}
                      onChange={(e) => handleMetaChange('title', e.target.value)}
                      placeholder="Enter book title"
                    />
                  </div>
                  <div className="flex flex-col bg-white/5 items-start justify-center rounded-md p-4 gap-2 border border-white/10">
                    <h3 className="font-semibold text-white text-nowrap underline decoration-stop-1">Author</h3>
                    <input 
                      type="text"
                      className="border-2 rounded-md p-2 w-full border-white/20 focus:border-stop-1 bg-white/10 text-white outline-none transition-colors"
                      value={meta.author}
                      onChange={(e) => handleMetaChange('author', e.target.value)}
                      placeholder="Enter author name"
                    />
                  </div>
                  <div className="flex flex-col bg-white/5 items-start justify-center rounded-md p-4 gap-2 border border-white/10">
                    <h3 className="font-semibold text-white text-nowrap underline decoration-stop-1">Pages</h3>
                    <input 
                      type="number"
                      className="border-2 rounded-md p-2 w-full border-white/10 bg-black/20 text-white/50 cursor-not-allowed"
                      value={meta.pages}
                      disabled={true}
                    />
                  </div>
                </div>
                
                <div className="bg-white/5 rounded-md p-4 border border-white/10 w-full max-h-full">
                  <h3 className="font-semibold text-white text-nowrap underline decoration-stop-1 mb-4">
                    Thumbnail
                  </h3>
                  {meta.thumbnail ? (
                    <img 
                      src={`data:image/jpeg;base64,${arrayToBase64(meta.thumbnail)}`}
                      alt="Book cover thumbnail"
                      className="w-full h-70 object-contain rounded-md shadow-lg"
                    />
                  ) : (
                    <div className="w-full h-full max-h-70 bg-black/20 rounded-md flex flex-col gap-2 items-center justify-center border-2 border-dashed border-white/20 text-white/40">
                      <FileText size={40} />
                      <span className="text-sm text-center">
                        No thumbnail available
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col bg-white/5 items-start justify-center rounded-md p-4 gap-2 border border-white/10">
                  <h3 className="font-semibold text-white text-nowrap underline decoration-stop-1">File Size</h3>
                  <input 
                    type="text"
                    className="border-2 rounded-md p-2 w-full border-white/10 bg-black/20 text-white/50 cursor-not-allowed"
                    value={formatFileSize(meta.filesize)}
                    disabled={true}
                  />
                </div>
                <div className="flex flex-col bg-white/5 items-start justify-center rounded-md p-4 gap-2 border border-white/10">
                  <h3 className="font-semibold text-white text-nowrap underline decoration-stop-1">Created At</h3>
                  <input 
                    type="text"
                    className="border-2 rounded-md p-2 w-full border-white/10 bg-black/20 text-white/50 cursor-not-allowed"
                    value={meta.creationdate ? formatDate(meta.creationdate) : 'N/A'}
                    disabled={true}
                  />
                </div>
              </div>
            </div>
          )}

          {file && !loading && (
            <div className="flex flex-col bg-app-card backdrop-blur-sm rounded-md p-6 border border-white/20">
              <span className="text-md text-white mb-6 flex justify-start items-center gap-2 font-bold">
                <Library className="w-5 h-5" />
                Organize Your Book
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
              <div className="mt-6">
                {/* Tag Selection */}
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
            </div>
          )}

          {file && meta && (collectionInput && shelfInput) && (
            <div className="flex justify-end items-center mt-4">
              {saveError != '' && (
                <p className="bg-red-500 text-sm text-white font-bold px-3 py-1.5 rounded-md mr-4 shadow-lg">
                  {saveError}
                </p>
              )}
              <button
                onClick={saveBook}
                disabled={saving}
                className="bg-green-600 hover:bg-green-500 disabled:bg-green-800/50 text-white px-6 py-2 rounded-md transition-all flex items-center gap-2 font-bold shadow-lg active:scale-95 cursor-pointer"
              >
                {saving ? (
                  <>
                    <Spinner />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save Book
                  </>
                )}
              </button>
            </div>
          )}
      </div>
    </SocialLayout>
  )
}

export default UploadPage;
