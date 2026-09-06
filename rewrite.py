import re

with open(r'src/app/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

dashboard_start = content.find('function AdminDashboard')
if dashboard_start == -1:
    print('AdminDashboard not found!')
    exit(1)

dashboard_end = content.find('export default App', dashboard_start)

# We want to replace from dashboard_start to just before 'export default App'

new_dashboard = '''function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [activeSection, setActiveSection] = useState("overview");
  const [categories, setCategories] = useState<APICategory[]>([]);
  const [images, setImages] = useState<APIImage[]>([]);
  const [stats, setStats] = useState<any>(null);
  
  // Upload state
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadCat, setUploadCat] = useState("");
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadDesc, setUploadDesc] = useState("");
  const [uploadFeatured, setUploadFeatured] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeSection]);

  async function fetchData() {
    try {
      if (activeSection === "overview") {
        const s = await adminGetDashboardStats();
        if (s.success) setStats(s.stats);
        const imgs = await adminGetImages();
        setImages(imgs.slice(0, 8));
      } else if (activeSection === "gallery") {
        const imgs = await adminGetImages();
        setImages(imgs);
        const cats = await adminGetCategories();
        setCategories(cats);
      } else if (activeSection === "categories") {
        const cats = await adminGetCategories();
        setCategories(cats);
      } else if (activeSection === "upload") {
        const cats = await adminGetCategories();
        setCategories(cats);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleUpload() {
    if (!uploadFile) return alert("Please select an image first.");
    if (!uploadCat) return alert("Please select a category.");
    
    setUploading(true);
    const fd = new FormData();
    fd.append("image", uploadFile);
    fd.append("category_id", uploadCat);
    fd.append("title", uploadTitle);
    fd.append("description", uploadDesc);
    fd.append("is_featured", uploadFeatured ? "true" : "false");
    
    try {
      const res = await adminUploadImage(fd);
      if (res.success) {
        alert("Image uploaded successfully!");
        setUploadFile(null);
        setUploadTitle("");
        setUploadDesc("");
        setUploadFeatured(false);
        setActiveSection("gallery"); 
      } else {
        alert("Upload Failed: " + (res.message || "Unknown error"));
      }
    } catch (err) {
      alert("Error during upload.");
    }
    setUploading(false);
  }

  async function handleDeleteImage(id: number) {
    if (!window.confirm("Are you sure you want to delete this image?")) return;
    try {
      const res = await adminDeleteImage(id);
      if (res.success) {
        setImages(images.filter(img => img.id !== id));
      } else {
        alert("Delete Failed: " + (res.message || "Unknown error"));
      }
    } catch (err) {
      alert("Error deleting image.");
    }
  }

  async function handleAddCategory() {
    const name = window.prompt("Enter new category name:");
    if (!name) return;
    try {
      const success = await adminAddCategory(name);
      if (success) {
        fetchData();
      } else {
        alert("Failed to add category.");
      }
    } catch (err) {
      alert("Error adding category.");
    }
  }

  async function handleDeleteCategory(id: number) {
    if (!window.confirm("Are you sure you want to delete this category? All associated images will also be removed!")) return;
    try {
      const success = await adminDeleteCategory(id);
      if (success) {
        setCategories(categories.filter(cat => cat.id !== id));
      } else {
        alert("Failed to delete category.");
      }
    } catch (err) {
      alert("Error deleting category.");
    }
  }

  const getCategoryName = (id: number) => {
    return categories.find(c => c.id === id)?.name || "Unknown";
  };

  const navItems = [
    { id: "overview",    label: "Overview",      icon: <LayoutGrid size={15} /> },
    { id: "gallery",     label: "Gallery",        icon: <ImageIcon size={15} />  },
    { id: "upload",      label: "Upload Image",   icon: <Upload size={15} />     },
    { id: "categories",  label: "Categories",     icon: <Settings size={15} />   },
  ];

  return (
    <div className="min-h-screen flex" style={{ background: "#050505", fontFamily: "'Inter', sans-serif" }}>
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 flex flex-col"
        style={{ background: "rgba(255,255,255,0.02)", borderRight: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="p-6" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <p className="text-white font-bold text-sm">B&B Admin</p>
          <p className="text-[#A0A0A0] text-xs mt-0.5">Gallery Management</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => setActiveSection(item.id)}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] transition-all duration-300 text-left"
              style={{
                color: activeSection === item.id ? "#FFD900" : "#A0A0A0",
                background: activeSection === item.id ? "rgba(255,217,0,0.06)" : "transparent",
                borderLeft: activeSection === item.id ? "2px solid #FFD900" : "2px solid transparent",
              }}>
              {item.icon} {item.label}
            </button>
          ))}
        </nav>
        <div className="p-3" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <button onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-[#A0A0A0] hover:text-red-400 transition-colors text-left">
            <LogOut size={15} /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-10 overflow-auto">
        <div className="mb-10">
          <h1 className="text-xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
            {activeSection === "overview" ? "Dashboard Overview"
              : activeSection === "gallery" ? "Gallery Manager"
              : activeSection === "upload" ? "Upload Image"
              : "Categories"}
          </h1>
          <div className="h-px w-10 bg-[#FFD900] mt-3" />
        </div>

        {/* Overview */}
        {activeSection === "overview" && (
          <div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
              <div className="p-6" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "2px" }}>
                <p className="text-[#A0A0A0] text-[10px] tracking-[0.25em] uppercase mb-3">Total Images</p>
                <p className="text-3xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>{stats?.total_images || 0}</p>
              </div>
              <div className="p-6" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "2px" }}>
                <p className="text-[#A0A0A0] text-[10px] tracking-[0.25em] uppercase mb-3">Categories</p>
                <p className="text-3xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>{stats?.total_categories || 0}</p>
              </div>
              <div className="p-6" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "2px" }}>
                <p className="text-[#A0A0A0] text-[10px] tracking-[0.25em] uppercase mb-3">Active Sections</p>
                <p className="text-3xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>{stats?.active_categories || 0}</p>
              </div>
              <div className="p-6" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "2px" }}>
                <p className="text-[#A0A0A0] text-[10px] tracking-[0.25em] uppercase mb-3">Uploaded This Month</p>
                <p className="text-3xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>{stats?.uploaded_this_month || 0}</p>
              </div>
            </div>
            <p className="text-[#A0A0A0] text-xs tracking-widest uppercase mb-5">Recent Uploads</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((img) => (
                <div key={img.id} className="relative group overflow-hidden h-40" style={{ borderRadius: "2px" }}>
                  <img src={getFullImageUrl(img.thumbnail_url)} alt={img.title || "Image"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
              ))}
              {images.length === 0 && <p className="text-[#A0A0A0] text-sm">No recent uploads.</p>}
            </div>
          </div>
        )}

        {/* Upload */}
        {activeSection === "upload" && (
          <div className="max-w-lg">
            <label className="block border-2 border-dashed p-16 text-center mb-8 cursor-pointer transition-colors duration-300 hover:border-[#FFD900]/30"
              style={{ borderColor: "rgba(255,255,255,0.12)", borderRadius: "2px" }}>
              <input type="file" accept="image/png, image/jpeg, image/webp" className="hidden" onChange={(e) => setUploadFile(e.target.files?.[0] || null)} />
              <Upload size={28} className="mx-auto mb-4 text-[#A0A0A0]" />
              <p className="text-white text-sm mb-1">{uploadFile ? uploadFile.name : "Drop image here or click to browse"}</p>
              <p className="text-[#A0A0A0] text-xs">PNG, JPG, WEBP up to 10MB</p>
            </label>
            <div className="space-y-6">
              <div>
                <label className="text-[10px] text-[#A0A0A0] tracking-[0.25em] uppercase block mb-2">Category</label>
                <select 
                  className="w-full bg-transparent border-b text-white py-3 text-sm outline-none"
                  style={{ borderColor: "rgba(255,255,255,0.18)", background: "#050505", colorScheme: "dark" }}
                  value={uploadCat}
                  onChange={(e) => setUploadCat(e.target.value)}
                >
                  <option value="" disabled>Select a category...</option>
                  {categories.map((c) => <option key={c.id} value={c.id.toString()} style={{ background: "#0B0B0B" }}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] text-[#A0A0A0] tracking-[0.25em] uppercase block mb-2">Title</label>
                <input type="text" placeholder="Image title"
                  value={uploadTitle} onChange={(e) => setUploadTitle(e.target.value)}
                  className="w-full bg-transparent border-b text-white py-3 text-sm outline-none focus:border-[#FFD900] transition-colors"
                  style={{ borderColor: "rgba(255,255,255,0.18)" }} />
              </div>
              <div>
                <label className="text-[10px] text-[#A0A0A0] tracking-[0.25em] uppercase block mb-2">Description</label>
                <textarea rows={3} placeholder="Optional description..."
                  value={uploadDesc} onChange={(e) => setUploadDesc(e.target.value)}
                  className="w-full bg-transparent border-b text-white py-3 text-sm outline-none focus:border-[#FFD900] transition-colors resize-none"
                  style={{ borderColor: "rgba(255,255,255,0.18)" }} />
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="accent-[#FFD900]" checked={uploadFeatured} onChange={(e) => setUploadFeatured(e.target.checked)} />
                <span className="text-[#A0A0A0] text-sm">Mark as Featured</span>
              </label>
              <button 
                onClick={handleUpload}
                disabled={uploading}
                className="flex items-center gap-2 text-[#050505] bg-[#FFD900] hover:bg-[#E5B800] px-7 py-3 font-semibold text-sm transition-all duration-300 disabled:opacity-50"
                style={{ borderRadius: "2px" }}>
                <Upload size={14} /> {uploading ? "Uploading..." : "Upload Image"}
              </button>
            </div>
          </div>
        )}

        {/* Gallery */}
        {activeSection === "gallery" && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((img) => (
              <div key={img.id} className="relative group overflow-hidden h-40" style={{ borderRadius: "2px" }}>
                <img src={getFullImageUrl(img.thumbnail_url)} alt={img.title || "Image"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-3">
                  <p className="text-white text-xs font-medium text-center">{img.title}</p>
                  <p className="text-[#FFD900] text-[10px] tracking-wide">{getCategoryName(img.category_id)}</p>
                  <div className="flex gap-2 mt-1">
                    <a href={getFullImageUrl(img.image_url)} target="_blank" rel="noreferrer" className="p-1.5" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "2px" }}><Eye size={11} className="text-white" /></a>
                    <button onClick={() => handleDeleteImage(img.id)} className="p-1.5" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "2px" }}><X size={11} className="text-red-400" /></button>
                  </div>
                </div>
              </div>
            ))}
            {images.length === 0 && <p className="text-[#A0A0A0] text-sm">No images found.</p>}
          </div>
        )}

        {/* Categories */}
        {activeSection === "categories" && (
          <div className="max-w-xl">
            <div className="space-y-1.5 mb-8">
              {categories.map((cat) => (
                <div key={cat.id}
                  className="flex items-center justify-between px-5 py-3 transition-all duration-300"
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "2px" }}>
                  <span className="text-white text-sm">{cat.name}</span>
                  <div className="flex gap-4">
                    <button onClick={() => handleDeleteCategory(cat.id)} className="text-[#A0A0A0] hover:text-red-400 text-xs transition-colors">Delete</button>
                  </div>
                </div>
              ))}
              {categories.length === 0 && <p className="text-[#A0A0A0] text-sm">No categories found.</p>}
            </div>
            <button onClick={handleAddCategory} className="flex items-center gap-2 text-[#050505] bg-[#FFD900] hover:bg-[#E5B800] px-6 py-3 font-semibold text-sm transition-all"
              style={{ borderRadius: "2px" }}>
              + Add Category
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
'''

new_content = content[:dashboard_start] + new_dashboard + "\n\n" + content[dashboard_end:]

with open(r'src/app/App.tsx', 'w', encoding='utf-8') as f:
    f.write(new_content)

print('Updated App.tsx')
