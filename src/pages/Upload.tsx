import FileDropArea from '../components/common/FileDropArea'
import { useNavigate } from 'react-router-dom'
import { File, FileText, Info, Library, Save, Upload } from 'lucide-react';
import { AutocompleteDropdown, DropdownOption } from '../components/common/dropdown/AutocompleteDropdown';
import { useEffect, useState } from 'react';
import { documentCache } from '../service/DocumentCache';
import { type PDFMetadata } from '../service/types/DocumentCache';
import { type ShelfObject } from '../../electron/database/objects/Shelf';
import { type CollectionObject } from '../../electron/database/objects/Collection';
import { Spinner } from '../components/common/spinner/Spinner';
import { formatDate, toUnix } from '../service/util/Date';
import { formatFileSize } from '../service/util/FileSize';
import { arrayToBase64 } from '../service/util/Thumbnail';
import { TagManager } from '../components/common/TagManager';


function UploadPage() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [meta, setMeta] = useState<PDFMetadata | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  
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

  const [shelves, setShelves] = useState<DropdownOption[]>([]);
  const [collections, setCollections] = useState<CollectionObject[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [collectOptions, setCollectOptions] = useState<DropdownOption[]>([]);
  const [selectedShelf, setSelectedShelf] = useState<DropdownOption | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<CollectionObject | null>(null);
  const [collectionInput, setCollectionInput] = useState<string>('');
  const [shelfInput, setShelfInput] = useState<string>('');

  useEffect(() => {
    const loadShelves = async () => {
      try {
        // @ts-ignore
        const response: ShelfObject[] = await window.db.shelf.getAll();
        const s = response.map((shelf) => ({id: shelf.id, name: shelf.name}))

        setShelves(s);
      } catch (error: any) {
        // Error message
        setShelves([]);
      }
    }

    const loadCollections = async () => {
      try {
        // @ts-ignore
        const response: CollectionObject[] = await window.db.collection.getAll();
        const collectionOptions = response.map(collection => ({ 
          id: collection.id, 
          name: collection.name 
        }));
        setCollections(response);
        setCollectOptions(collectionOptions);
      } catch (error: any) {
        // Error message
        setCollections([]);
        setCollectOptions([]);
      }
    }

    loadShelves();
    loadCollections();
  }, [])

  const saveBook = async () => {
    if (file && meta) {
      setSaving(true);
      const cn = selectedCollection ? selectedCollection.name : collectionInput;
      const sn = selectedShelf ? selectedShelf.name : shelfInput;

      let data: any = {
        ...meta,
        tags: tags
      }
      if (meta.title == null) data.title = "N/A";
      if (meta.author == null) data.author = "N/A";
      if (meta.creationdate) data.createdAt = toUnix(meta.creationdate);

      // TODO: validation for metadata
      // TODO: error view
      
      // @ts-ignore
      const error = await window.db.book.add(file.path, data, cn, sn);
      setSaving(false);

      if (error) {
        // error
        setError(error);
      } else {
        navigate('/library');
      }
    }
  }

  const handleTagChange = (tags: string[]) => {
    setTags(tags);
  }

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
      // @ts-ignore
      const data = await documentCache.getMetadata(file.path);
      setMeta(data);
      setLoading(false);
    } else {
      setMeta(null);
    }
  }

  const handleCollectionInputChange = (value: string) => {
    setCollectionInput(value);
  };

  const handleCollectionSelect = (collection: DropdownOption | null) => {
    if (!collection) {
      setCollectionInput('');
      setSelectedCollection(null);
      setSelectedShelf(null);
      setShelfInput('');
      setCollectOptions(collections);
    } else {
      const c = collections.find((cc) => cc.id === collection.id);
      setSelectedCollection(c ? c : null);
      if (c) {
        const s = shelves.find((ss) => ss.id === c.shelfId);
        setSelectedShelf(s ? s : null);
        setShelfInput(s ? s.name : '');
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
      setShelfInput('');
      setCollectionInput('');
      setCollectOptions(collections.map(collection => ({ 
          id: collection.id, 
          name: collection.name 
      })));
      // setShelves
    }

    if (shelf && !selectedCollection) {
      setCollectOptions(
        collections.filter((c) => c.shelfId === shelf.id).map(collection => ({ 
          id: collection.id, 
          name: collection.name 
        }))
      );
    }
  };

  

  return (
    <div className="min-h-screen p-5 space-y-4">
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
        <div className="flex flex-row items-center justify-center gap-2 z-30 my-10 bg-app-card border border-white/20 backdrop-blur-sm rounded-md p-4">
          <Spinner />
          <p className="text-white font-bold text-center text-md">
            Loading..
          </p>
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
            <div>
              <AutocompleteDropdown 
                title="Collection"
                placeholder="Select a collection"
                options={collectOptions}
                value={collectionInput}
                onValueChange={handleCollectionInputChange}
                onOptionSelect={handleCollectionSelect}
              />
              {!selectedCollection && collectionInput && <span className="mt-2 text-stop-1 font-bold text-sm block italic">This collection will be created</span>}
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
              {!selectedShelf && shelfInput && <span className="mt-2 text-stop-1 font-bold text-sm block italic">This shelf will be created</span>}
            </div>
          </div>
          <div className="mt-6">
            {/* Tag Selection */}
            <TagManager 
              currentTags={tags}
              onTagsChange={handleTagChange}
            />
          </div>
        </div>
      )}

       {file && meta && (collectionInput && shelfInput) && (
        <div className="flex justify-end items-center mt-4">
          {error != '' && (
            <p className="bg-red-500 text-sm text-white font-bold px-3 py-1.5 rounded-md mr-4 shadow-lg">
              {error}
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
  )
}

export default UploadPage;
