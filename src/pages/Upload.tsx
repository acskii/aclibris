import FileDropArea from '../components/common/FileDropArea'
import { useNavigate } from 'react-router-dom'
import { File, Info, Library, Save, Upload } from 'lucide-react';
import { AutocompleteDropdown, DropdownOption } from '../components/common/dropdown/AutocompleteDropdown';
import { useEffect, useState } from 'react';
import { documentCache } from '../service/DocumentCache';
import { type PDFMetadata } from '../service/types/DocumentCache';
import { type ShelfObject } from '../../electron/database/objects/Shelf';
import { type CollectionObject } from '../../electron/database/objects/Collection';
import { Spinner } from '../components/common/spinner/Spinner';
import { formatDate, toUnix } from '../service/util/Date';
import { formatFileSize } from '../service/util/FileSize';


function UploadPage() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [meta, setMeta] = useState<PDFMetadata | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  
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
  const [collectOptions, setCollectOptions] = useState<DropdownOption[]>([]);
  const [selectedShelf, setSelectedShelf] = useState<DropdownOption | null>(null);
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
        // Error message
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
        ...meta
      }
      if (meta.creationdate) data.createdAt = toUnix(meta.creationdate);

      // TODO: validation for metadata
      // TODO: error view

      await window.db.book.add(file.path, data, cn, sn);
      setSaving(false);
      navigate('/library');
    }
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
      setShelves
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
        <h1 className="mb-2 flex gap-3 justify-start">
          <Upload className="w-10 h-10" />
          <span className="text-4xl font-bold text-white">Upload Book</span>
        </h1>
        <p>
          Add new books to your library
        </p>
      </div>  
      
      <div className="flex flex-col bg-gray-800/30 backdrop-blur-sm rounded-md p-6 border border-indigo-500/20">
        <span className="text-md text-white mb-6 flex justify-start">Drag and drop, or click below to upload a PDF file to be saved as a book in your library</span>
        <div className="flex flex-row gap-2">
          <div className="grow-1">
            <FileDropArea onFileSelect={handleFile} />
          </div>
          <div className="grow-1 bg-indigo-900/20 rounded-md p-4 flex justify-center lg:justify-start items-center border border-indigo-500/30">
            <div className="flex flex-col lg:flex-row items-start gap-3 max-w-full">
              <div className="flex flex-row gap-1">
                <Info className="w-5 h-5 text-indigo-300 mt-0.5 flex-shrink-0" />
                <h3 className="font-semibold text-indigo-200 text-nowrap">File Requirements:</h3>
              </div>
              <div className="flex items-center justify-center text-left">
                <ul className="text-indigo-100/80 text-sm">
                  <li>• Only .pdf files are supported</li>
                  <li>• Files should not be password protected</li>
                </ul>
              </div>
            </div>
          </div>
        </div> 
      </div>

      {loading && (
        <div className="flex flex-row items-center justify-center gap-2 z-30 my-10 bg-blue-400 backdrop-blur-sm rounded-md p-4">
          <Spinner />
          <p className="text-violet-900 font-bold text-center text-md">
            Loading..
          </p>
        </div>
      )}

      {meta && (
        <div className="flex flex-col bg-gray-800/30 backdrop-blur-sm rounded-md p-6 border border-indigo-500/20">
          <span className="text-md text-white mb-6 flex justify-start items-center gap-2">
            <File className="w-5 h-5" />
            File Information
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col bg-indigo-800/20 items-start justify-center rounded-md p-4 gap-2">
              <h3 className="font-semibold text-white text-nowrap underline decoration-cyan-400">Title</h3>
              <input 
                type="text"
                className="border border-2 rounded-md p-2 w-full border-cyan-400/60 focus:border-violet-800/60 bg-white/10 text-white"
                value={meta.title || 'N/A'}
                onChange={(e) => handleMetaChange('title', e.target.value)}
                placeholder="Enter book title"
              />
            </div>
            <div className="flex flex-col bg-indigo-800/20 items-start justify-center rounded-md p-4 gap-2">
              <h3 className="font-semibold text-white text-nowrap underline decoration-cyan-400">Author</h3>
              <input 
                type="text"
                className="border border-2 rounded-md p-2 w-full border-cyan-400/60 focus:border-violet-800/60 bg-white/10 text-white"
                value={meta.author || 'N/A'}
                onChange={(e) => handleMetaChange('author', e.target.value)}
                placeholder="Enter author name"
              />
            </div>
            <div className="flex flex-col bg-indigo-800/20 items-start justify-center rounded-md p-4 gap-2">
              <h3 className="font-semibold text-white text-nowrap underline decoration-cyan-400">File Size (Bytes)</h3>
              <input 
                type="text"
                className="border border-2 rounded-md p-2 w-full border-cyan-400/60 focus:border-violet-800/60 bg-gray-600/50 text-white"
                value={formatFileSize(meta.filesize)}
                disabled={true}
              />
            </div>
            <div className="flex flex-col bg-indigo-800/20 items-start justify-center rounded-md p-4 gap-2">
              <h3 className="font-semibold text-white text-nowrap underline decoration-cyan-400">Pages</h3>
              <input 
                type="number"
                className="border border-2 rounded-md p-2 w-full border-cyan-400/60 focus:border-violet-800/60 bg-gray-600/50 text-white"
                value={meta.pages}
                disabled={true}
              />
            </div>
            <div className="flex flex-col bg-indigo-800/20 items-start justify-center rounded-md p-4 gap-2">
              <h3 className="font-semibold text-white text-nowrap underline decoration-cyan-400">Created At</h3>
              <input 
                type="text"
                className="border border-2 rounded-md p-2 w-full border-cyan-400/60 focus:border-violet-800/60 bg-gray-600/50 text-white"
                value={meta.creationdate ? formatDate(meta.creationdate) : 'N/A'}
                disabled={true}
              />
            </div>
          </div>
        </div>
      )}

      {file && !loading && (
        <div className="flex flex-col bg-gray-800/30 backdrop-blur-sm rounded-md p-6 border border-indigo-500/20">
          <span className="text-md text-white mb-6 flex justify-start items-center gap-2">
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
            </div>
          </div>

          {/* Organization Summary */}
          {(shelfInput || collectionInput) && (
            <div className="bg-violet-900/20 rounded-lg p-4 border border-violet-500/30 mt-4">
              <h4 className="font-semibold text-violet-200 mb-2">Organization Summary:</h4>
              <div className="text-violet-100/80 text-sm space-y-1">
                <div>
                  <strong>Shelf:</strong> {selectedShelf ? selectedShelf.name : shelfInput} 
                  {!selectedShelf && shelfInput && <span className="text-violet-300 ml-2">(new)</span>}
                </div>
                <div>
                  <strong>Collection:</strong> {selectedCollection ? selectedCollection.name : collectionInput}
                  {!selectedCollection && collectionInput && <span className="text-violet-300 ml-2">(new)</span>}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

       {file && meta && (collectionInput && shelfInput) && (
        <div className="flex justify-end">
          <button
            onClick={saveBook}
            disabled={saving}
            className="bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white px-4 py-1 rounded-md transition-colors flex items-center gap-2"
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
