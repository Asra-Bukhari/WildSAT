import { useState, useCallback } from "react";
import axios from "axios";
import Map from "react-map-gl/mapbox";
import { Marker, Popup } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { generateCoordinates, refreshCoordinateSalt } from "./utils/generateCoordinates";
import { ecologyInfo } from "./utils/ecologyInfo";
import "./App.css";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

function App() {
  const [mode, setMode] = useState(null);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const [uploadedImage, setUploadedImage] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);

  const handleSearch = useCallback(async () => {
    if (!query.trim() || loading) return;
    setLoading(true);
    setSelected(null);
    try {
      const res = await axios.get(
        `${API_BASE_URL}/search?query=${encodeURIComponent(query)}`
      );
      // Refresh salt so each search produces unique locations
      refreshCoordinateSalt();
      const enriched = res.data.results.map((item, i) => {
        const [lng, lat] = generateCoordinates(i, query);
        return { ...item, longitude: lng, latitude: lat };
      });
      setResults(enriched);
      setSearched(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [query, loading]);

  const handleReset = useCallback(() => {
    setQuery("");
    setResults([]);
    setSelected(null);
    setSearched(false);
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadedImage(URL.createObjectURL(file));
    setUploadLoading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await axios.post(`${API_BASE_URL}/upload`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setAnalysisResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setUploadLoading(false);
    }
  };

  const goHome = useCallback(() => {
    setMode(null);
    setQuery("");
    setResults([]);
    setSelected(null);
    setSearched(false);
    setUploadedImage(null);
    setAnalysisResult(null);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const scoreColor = (s) => {
    if (s > 0.7) return "linear-gradient(90deg, #00f5a0, #00d9f5)";
    if (s > 0.4) return "linear-gradient(90deg, #f5a623, #f5d020)";
    return "linear-gradient(90deg, #ff6b6b, #ee5a24)";
  };

  const selectedClass = selected ? selected.image.split("/")[4] : null;
  const selectedInfo = selectedClass ? ecologyInfo[selectedClass] : null;

  const starfield = (
    <div className="starfield">
      <div className="stars-layer stars-sm" />
      <div className="stars-layer stars-md" />
      <div className="stars-layer stars-lg" />
      <div className="nebula" />
    </div>
  );

  const brand = (
    <div className="header-brand">
      <div className="brand-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      </div>
      <div>
        <div className="brand-title">WildSAT</div>
        <div className="brand-subtitle">Ecological Intelligence</div>
      </div>
    </div>
  );

  // =================== HOME ===================
  if (!mode) {
    return (
      <div className="app landing">
        {starfield}
        <header className="header header--landing">
          <div className="header-inner header-inner--center">{brand}</div>
        </header>
        <main className="landing-main">
          <div className="home-center">
            <div className="landing-visual">
              <div className="landing-glow" />
              <div className="landing-ring ring-1" />
              <div className="landing-ring ring-2" />
              <div className="landing-globe">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h20" />
                  <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                </svg>
              </div>
            </div>
            <h1 className="landing-title">Explore Earth's Ecosystems</h1>
            <p className="landing-text">Choose a mode to begin analyzing satellite imagery with AI</p>
            <div className="mode-cards">
              <button className="mode-card" onClick={() => setMode("zero-shot")}>
                <div className="mode-card-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /><path d="M11 8v6" /><path d="M8 11h6" />
                  </svg>
                </div>
                <h3 className="mode-card-title">Zero-Shot Habitat Retrieval</h3>
                <p className="mode-card-desc">Describe any habitat in words and discover matching satellite imagery from across the globe</p>
                <span className="mode-card-action">Get Started</span>
              </button>
              <button className="mode-card" onClick={() => setMode("diagnosis")}>
                <div className="mode-card-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
                <h3 className="mode-card-title">Habitat Diagnosis from Image</h3>
                <p className="mode-card-desc">Upload a satellite image and receive instant AI-powered ecological analysis and classification</p>
                <span className="mode-card-action">Upload Image</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // =================== ZERO-SHOT : SEARCH ===================
  if (mode === "zero-shot" && !searched) {
    return (
      <div className="app landing">
        {starfield}
        <header className="header header--landing">
          <div className="header-inner">
            {brand}
            <div className="search-section">
              <p className="search-tagline">Zero-Shot Habitat Retrieval from Satellite Imagery</p>
              <div className="search-row">
                <div className="search-input-group">
                  <svg className="search-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                  </svg>
                  <input type="text" className="search-input" placeholder="e.g. tropical rainforest, arctic tundra, coral reef…" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={handleKeyDown} />
                  {loading && <div className="input-spinner" />}
                </div>
                <button className="search-btn" onClick={handleSearch} disabled={loading || !query.trim()}>
                  {loading ? (
                    <><div className="btn-spinner" /><span>Searching</span></>
                  ) : (
                    <><svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" /></svg><span>Discover</span></>
                  )}
                </button>
                <button className="back-btn" onClick={goHome}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
                  </svg>
                  Back
                </button>
              </div>
            </div>
          </div>
        </header>
        <main className="landing-main">
          <div className="landing-center">
            <div className="landing-visual">
              <div className="landing-glow" />
              <div className="landing-ring ring-1" />
              <div className="landing-ring ring-2" />
              <div className={`landing-globe${loading ? " landing-globe--loading" : ""}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                </svg>
              </div>
            </div>
            <h1 className="landing-title">Search Earth's Ecosystems</h1>
            <p className="landing-text">Describe any habitat and discover satellite imagery matched by our AI in real time</p>
          </div>
        </main>
      </div>
    );
  }

  // =================== ZERO-SHOT : MAP ===================
  if (mode === "zero-shot" && searched) {
    return (
      <div className="app">
        <header className="header header--compact">
          <div className="header-inner">
            {brand}
            <div className="search-section">
              <div className="search-row">
                <div className="search-input-group">
                  <svg className="search-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
                  <input type="text" className="search-input" placeholder="Search another habitat…" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={handleKeyDown} />
                </div>
                <button className="search-btn" onClick={handleSearch} disabled={loading || !query.trim()}>
                  {loading ? <><div className="btn-spinner" /><span>Searching</span></> : <><svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" /></svg><span>Discover</span></>}
                </button>
                <button className="reset-btn" onClick={handleReset} title="New search">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 102.13-9.36L1 10" /></svg>
                </button>
                <button className="back-btn" onClick={goHome}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
                  Back
                </button>
              </div>
            </div>
          </div>
        </header>
        <main className="map-area">
          <Map mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN} mapStyle="mapbox://styles/mapbox/satellite-streets-v12" initialViewState={{ longitude: 0, latitude: 20, zoom: 1.5 }} style={{ width: "100%", height: "100%" }}>
            {results.map((item, i) => (
              <Marker key={i} longitude={item.longitude} latitude={item.latitude} anchor="bottom">
                <div className={`marker${selected === item ? " marker--active" : ""}`} onClick={(e) => { e.stopPropagation(); setSelected(item); }}>
                  <div className="marker-pulse" />
                  <div className="marker-pin">
                    <svg viewBox="0 0 26 36" fill="none">
                      <defs><linearGradient id={`pin-${i}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#00f5a0" /><stop offset="100%" stopColor="#00d9f5" /></linearGradient></defs>
                      <path d="M13 0C5.82 0 0 5.82 0 13c0 8.12 10.4 20.8 11.7 22.3a1.6 1.6 0 002.6 0C15.6 33.8 26 21.12 26 13 26 5.82 20.18 0 13 0z" fill={`url(#pin-${i})`} />
                      <circle cx="13" cy="13" r="5.2" fill="#0a0e17" />
                    </svg>
                  </div>
                </div>
              </Marker>
            ))}
            {selected && (
              <Popup longitude={selected.longitude} latitude={selected.latitude} anchor="top" onClose={() => setSelected(null)} closeOnClick={false} className="custom-popup" offset={22}>
                <div className="popup-card">
                  <div className="popup-image-wrap">
                    <img src={selected.image} alt="Satellite" className="popup-image" />
                    <div className="popup-badge">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                      <span>{(selected.score * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className="popup-body">
                    <h3 className="popup-title">{selectedInfo?.title || selectedClass}</h3>
                    <div className="popup-grid">
                      <div className="popup-item"><span className="popup-item-label">Climate</span><strong>{selectedInfo?.climate}</strong></div>
                      <div className="popup-item"><span className="popup-item-label">Biodiversity</span><strong>{selectedInfo?.biodiversity}</strong></div>
                      <div className="popup-item"><span className="popup-item-label">Vegetation</span><strong>{selectedInfo?.vegetation}</strong></div>
                      <div className="popup-item"><span className="popup-item-label">Species</span><strong>{selectedInfo?.habitat}</strong></div>
                      <div className="popup-item"><span className="popup-item-label">Risk</span><strong>{selectedInfo?.risk}</strong></div>
                    </div>
                    <div className="popup-confidence">
                      <div className="popup-conf-label">Match Confidence</div>
                      <div className="score-bar">
                        <div className="score-bar-fill" style={{ width: `${Math.min(selected.score * 100, 100)}%`, background: scoreColor(selected.score) }} />
                      </div>
                      <div className="popup-score">{(selected.score * 100).toFixed(2)}%</div>
                    </div>
                  </div>
                </div>
              </Popup>
            )}
          </Map>
        </main>
      </div>
    );
  }

  // =================== DIAGNOSIS : UPLOAD ===================
  if (mode === "diagnosis" && !analysisResult) {
    return (
      <div className="app landing">
        {starfield}
        <header className="header header--landing">
          <div className="header-inner">
            {brand}
            <div className="search-section">
              <p className="search-tagline">Upload a satellite image for instant AI-powered ecological analysis</p>
              <div className="search-row">
                <label className="upload-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="upload-btn-icon"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                  <span>{uploadLoading ? "Analyzing…" : "Choose Satellite Image"}</span>
                  <input type="file" accept="image/*" hidden onChange={handleImageUpload} disabled={uploadLoading} />
                </label>
                {uploadLoading && (
                  <div className="upload-loading">
                    <div className="btn-spinner" />
                    <span>Analyzing ecosystem…</span>
                  </div>
                )}
                <button className="back-btn" onClick={goHome}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
                  Back
                </button>
              </div>
            </div>
          </div>
        </header>
        <main className="landing-main">
          <div className="upload-prompt">
            <div className="landing-visual">
              <div className="landing-glow" />
              <div className="upload-prompt-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>
            </div>
            <h1 className="landing-title">Habitat Diagnosis</h1>
            <p className="landing-text">Upload a satellite image and our AI will analyze its ecosystem,<br />climate, biodiversity, and ecological characteristics</p>
          </div>
        </main>
      </div>
    );
  }

  // =================== DIAGNOSIS : RESULTS ===================
  return (
    <div className="app">
      <header className="header header--compact">
        <div className="header-inner">
          {brand}
          <div className="search-section">
            <div className="search-row search-row--end">
              <label className="upload-btn upload-btn--sm">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="upload-btn-icon"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                <span>New Analysis</span>
                <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
              </label>
              <button className="back-btn" onClick={goHome}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
                Back
              </button>
            </div>
          </div>
        </div>
        {analysisResult && (
          <div className="results-bar">
            <div className="results-bar-inner">
              <span className="results-count">{analysisResult.confidence}%</span>
              <span>Detected: <strong className="results-query">{analysisResult.ecosystem}</strong> — {analysisResult.title}</span>
            </div>
          </div>
        )}
      </header>

      <main className="diagnosis-main">
        <div className="diagnosis-layout">
          <div className="diagnosis-image-col">
            <div className="diagnosis-image-card">
              {uploadedImage && <img src={uploadedImage} alt="Uploaded" className="diagnosis-image" />}
              {uploadLoading && (
                <div className="diagnosis-loading">
                  <div className="loading-ring" />
                  <p>Analyzing ecosystem…</p>
                </div>
              )}
            </div>
          </div>
          <div className="diagnosis-info-col">
            <div className="diagnosis-info-scroll">
              {analysisResult && (
                <div className="diagnosis-content">
                  <div className="diagnosis-header">
                    <h2 className="diagnosis-eco">{analysisResult.ecosystem}</h2>
                    <p className="diagnosis-title">{analysisResult.title}</p>
                  </div>

                  <div className="diagnosis-confidence-bar">
                    <div className="diagnosis-conf-label">Confidence Score</div>
                    <div className="score-bar score-bar--lg">
                      <div className="score-bar-fill" style={{ width: `${analysisResult.confidence}%`, background: analysisResult.confidence > 70 ? "linear-gradient(90deg, #00f5a0, #00d9f5)" : analysisResult.confidence > 40 ? "linear-gradient(90deg, #f5a623, #f5d020)" : "linear-gradient(90deg, #ff6b6b, #ee5a24)" }} />
                    </div>
                    <div className="diagnosis-conf-value">{analysisResult.confidence}%</div>
                  </div>

                  <div className="diagnosis-grid">
                    <div className="diagnosis-grid-item">
                      <div className="diagnosis-grid-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>
                      </div>
                      <span className="diagnosis-grid-label">Climate</span>
                      <strong className="diagnosis-grid-value">{analysisResult.climate}</strong>
                    </div>
                    <div className="diagnosis-grid-item">
                      <div className="diagnosis-grid-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                      </div>
                      <span className="diagnosis-grid-label">Biodiversity</span>
                      <strong className="diagnosis-grid-value">{analysisResult.biodiversity}</strong>
                    </div>
                    <div className="diagnosis-grid-item">
                      <div className="diagnosis-grid-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="M21 9l-9-6-6 4-3-2" /></svg>
                      </div>
                      <span className="diagnosis-grid-label">Vegetation</span>
                      <strong className="diagnosis-grid-value">{analysisResult.vegetation}</strong>
                    </div>
                    <div className="diagnosis-grid-item">
                      <div className="diagnosis-grid-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" /></svg>
                      </div>
                      <span className="diagnosis-grid-label">Species</span>
                      <strong className="diagnosis-grid-value">{Array.isArray(analysisResult.species) ? analysisResult.species.join(", ") : analysisResult.species}</strong>
                    </div>
                    <div className="diagnosis-grid-item diagnosis-grid-item--full">
                      <div className="diagnosis-grid-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M12 8v4" /><path d="M12 16h.01" /></svg>
                      </div>
                      <span className="diagnosis-grid-label">Ecological Risks</span>
                      <strong className="diagnosis-grid-value">{Array.isArray(analysisResult.risks) ? analysisResult.risks.join(" · ") : analysisResult.risks}</strong>
                    </div>
                  </div>

                  <div className="diagnosis-analysis">
                    <h3 className="diagnosis-analysis-title">Ecological Analysis</h3>
                    <p className="diagnosis-analysis-text">{analysisResult.analysis}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
