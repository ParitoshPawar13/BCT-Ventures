import React, { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  Activity, Archive, ArrowLeft, BadgeCheck, BarChart3, Bell, Bot, BriefcaseBusiness,
  CalendarDays, ChevronDown, ChevronRight, CircleAlert, Copy, DollarSign, ExternalLink,
  FileImage, FolderPlus, Layers3, MoreHorizontal, Pause, Pencil, Plus, Rocket, Search,
  Settings2, ShieldCheck, ShoppingBag, Sparkles, Target, Trash2, Upload, Users, X, Zap
} from 'lucide-react'
import './styles.css'

const STORAGE_KEY = 'adpilot_campaign_manager_v1'

const uid = (prefix) => `${prefix}_${Math.random().toString(36).slice(2, 9)}_${Date.now().toString(36)}`
const today = new Date().toISOString().slice(0, 10)

const makeAd = (overrides = {}) => ({
  id: uid('ad'),
  name: 'New Ad',
  status: 'DRAFT',
  headline: '',
  primaryText: '',
  creative: '',
  creativeName: '',
  cta: '',
  landingPageUrl: '',
  ...overrides
})

const makeAdSet = (overrides = {}) => ({
  id: uid('adset'),
  name: 'New Ad Set',
  status: 'DRAFT',
  locations: [],
  ageMin: 18,
  ageMax: 65,
  genders: ['All'],
  startDate: today,
  endDate: '',
  budget: 500,
  budgetType: 'DAILY',
  ads: [makeAd()],
  ...overrides
})

const makeCampaign = (overrides = {}) => ({
  id: uid('campaign'),
  name: '',
  objective: '',
  budgetType: 'DAILY',
  budget: 1000,
  status: 'DRAFT',
  adSets: [makeAdSet()],
  ...overrides
})

const seedData = [
  makeCampaign({
    name: 'Summer Sale — Demo',
    objective: 'SALES',
    budget: 2500,
    status: 'ACTIVE',
    adSets: [
      makeAdSet({
        name: 'Mumbai 18–35',
        status: 'ACTIVE',
        locations: ['Mumbai'],
        budget: 800,
        ads: [
          makeAd({
            name: 'Summer Hero',
            status: 'ACTIVE',
            headline: 'Flat 30% Off',
            primaryText: 'Discover our summer collection and save today.',
            creative: 'demo-gradient',
            creativeName: 'summer-hero.svg',
            cta: 'SHOP_NOW',
            landingPageUrl: 'https://example.com/summer'
          }),
          makeAd({
            name: 'Summer Carousel Copy',
            status: 'PAUSED',
            headline: 'Your summer starts here',
            primaryText: 'Fresh picks, limited-time pricing.',
            creative: 'demo-product',
            creativeName: 'summer-product.svg',
            cta: 'LEARN_MORE',
            landingPageUrl: 'https://example.com/collection'
          })
        ]
      }),
      makeAdSet({
        name: 'Pune Retargeting',
        status: 'DRAFT',
        locations: ['Pune'],
        budget: 600,
        ads: [
          makeAd({
            name: 'Retargeting Ad',
            headline: 'Still thinking about it?',
            primaryText: 'Come back and complete your purchase.',
            creative: '',
            creativeName: '',
            cta: 'SHOP_NOW',
            landingPageUrl: 'https://example.com/checkout'
          })
        ]
      })
    ]
  }),
  makeCampaign({
    name: 'Wellness Launch — Demo',
    objective: 'AWARENESS',
    budget: 1500,
    status: 'DRAFT',
    adSets: [
      makeAdSet({
        name: 'Health & Wellness Audience',
        locations: ['India'],
        budget: 500,
        ads: [
          makeAd({
            name: 'Wellness Introduction',
            headline: 'A better everyday routine',
            primaryText: 'Meet the new daily wellness range.',
            creative: 'demo-wellness',
            creativeName: 'wellness.svg',
            cta: 'LEARN_MORE',
            landingPageUrl: 'https://example.com/wellness'
          })
        ]
      })
    ]
  })
]

function loadCampaigns() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : seedData
  } catch {
    return seedData
  }
}

const objectiveLabels = {
  AWARENESS: 'Awareness',
  TRAFFIC: 'Traffic',
  ENGAGEMENT: 'Engagement',
  LEADS: 'Leads',
  SALES: 'Sales',
  APP_PROMOTION: 'App promotion'
}

const ctaLabels = {
  LEARN_MORE: 'Learn More',
  SHOP_NOW: 'Shop Now',
  SIGN_UP: 'Sign Up',
  GET_QUOTE: 'Get Quote',
  CONTACT_US: 'Contact Us',
  DOWNLOAD: 'Download',
  BOOK_NOW: 'Book Now'
}

function validateAd(ad) {
  const errors = []
  if (!ad.name.trim()) errors.push('Ad name is required.')
  if (!ad.headline.trim()) errors.push('Headline is missing.')
  if (!ad.primaryText.trim()) errors.push('Primary text is missing.')
  if (!ad.creative) errors.push('Creative is not uploaded.')
  if (!ad.cta) errors.push('CTA is required.')
  if (!ad.landingPageUrl.trim()) errors.push('Landing page URL is required.')
  else {
    try {
      const url = new URL(ad.landingPageUrl)
      if (!['http:', 'https:'].includes(url.protocol)) throw new Error()
    } catch {
      errors.push('Landing page URL must be a valid http(s) URL.')
    }
  }
  return errors
}

function validateAdSet(adSet) {
  const errors = []
  if (!adSet.name.trim()) errors.push('Ad set name is required.')
  if (!adSet.locations?.length) errors.push('At least one location is required.')
  if (Number(adSet.budget) <= 0) errors.push('Ad set budget must be greater than ₹0.')
  if (!adSet.startDate) errors.push('Start date is required.')
  if (adSet.endDate && adSet.endDate < adSet.startDate) errors.push('End date cannot be before start date.')
  if (Number(adSet.ageMin) < 13 || Number(adSet.ageMax) > 65 || Number(adSet.ageMin) >= Number(adSet.ageMax)) {
    errors.push('Age range must be between 13–65 and have a valid minimum/maximum.')
  }
  if (!adSet.ads.length) errors.push('At least one ad is required.')
  adSet.ads.forEach((ad) => validateAd(ad).forEach((e) => errors.push(`${ad.name || 'Ad'}: ${e}`)))
  return errors
}

function validateCampaign(campaign) {
  const errors = []
  if (!campaign.name.trim()) errors.push('Campaign name is required.')
  if (!campaign.objective) errors.push('Objective is required.')
  if (Number(campaign.budget) <= 0) errors.push('Campaign budget must be greater than ₹0.')
  if (!campaign.adSets.length) errors.push('At least one ad set is required.')
  campaign.adSets.forEach((adSet) => validateAdSet(adSet).forEach((e) => errors.push(`${adSet.name || 'Ad set'}: ${e}`)))
  return errors
}

function readiness(campaign) {
  const errors = validateCampaign(campaign)
  return { ready: errors.length === 0, errors }
}

function statusLabel(status) {
  return { ACTIVE: 'Active', PAUSED: 'Paused', ARCHIVED: 'Archived', DRAFT: 'Draft' }[status] || status
}

function statusClass(status) {
  return `status status-${status.toLowerCase()}`
}

function App() {
  const [campaigns, setCampaigns] = useState(loadCampaigns)
  const [selectedId, setSelectedId] = useState(() => loadCampaigns()[0]?.id || null)
  const [expandedCampaigns, setExpandedCampaigns] = useState(() => new Set(loadCampaigns().map(c => c.id)))
  const [expandedAdSets, setExpandedAdSets] = useState(() => new Set())
  const [search, setSearch] = useState('')
  const [selectedAds, setSelectedAds] = useState([])
  const [selectedAdSets, setSelectedAdSets] = useState([])
  const [bulkMode, setBulkMode] = useState(null)
  const [toast, setToast] = useState(null)
  const [modal, setModal] = useState(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

useEffect(() => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(campaigns))
  } catch (error) {
    console.error('Could not save campaigns:', error)

    if (error?.name === 'QuotaExceededError') {
      setToast({
        message: 'Browser storage is full. Please use a smaller creative image.',
        type: 'error'
      })
    } else {
      setToast({
        message: 'Could not save your changes.',
        type: 'error'
      })
    }
  }
}, [campaigns])

  useEffect(() => {
    if (!campaigns.some(c => c.id === selectedId)) setSelectedId(campaigns[0]?.id || null)
  }, [campaigns, selectedId])

  const selectedCampaign = campaigns.find(c => c.id === selectedId) || null
  const filteredCampaigns = campaigns.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))

  const flash = (message, type = 'success') => {
    setToast({ message, type })
    window.setTimeout(() => setToast(null), 3000)
  }

  const updateCampaign = (id, patch) => {
    setCampaigns(prev => prev.map(c => c.id === id ? { ...c, ...patch } : c))
  }

  const updateAdSet = (campaignId, adSetId, patch) => {
    setCampaigns(prev => prev.map(c => c.id !== campaignId ? c : ({
      ...c,
      adSets: c.adSets.map(a => a.id === adSetId ? { ...a, ...patch } : a)
    })))
  }

  const updateAd = (campaignId, adSetId, adId, patch) => {
    setCampaigns(prev => prev.map(c => c.id !== campaignId ? c : ({
      ...c,
      adSets: c.adSets.map(s => s.id !== adSetId ? s : ({
        ...s,
        ads: s.ads.map(a => a.id === adId ? { ...a, ...patch } : a)
      }))
    })))
  }

  const addCampaign = () => {
    const c = makeCampaign({ name: `New Campaign ${campaigns.length + 1}` })
    setCampaigns(prev => [c, ...prev])
    setSelectedId(c.id)
    setExpandedCampaigns(prev => new Set([...prev, c.id]))
    flash('Campaign created. Complete the required fields to make it ready.')
  }

  const duplicateCampaign = (campaign) => {
    const copy = JSON.parse(JSON.stringify(campaign))
    copy.id = uid('campaign')
    copy.name = `${campaign.name || 'Campaign'} - Copy`
    copy.status = 'DRAFT'
    copy.adSets.forEach(s => {
      s.id = uid('adset')
      s.name = `${s.name || 'Ad Set'} - Copy`
      s.status = 'DRAFT'
      s.ads.forEach(a => {
        a.id = uid('ad')
        a.name = `${a.name || 'Ad'} - Copy`
        a.status = 'DRAFT'
      })
    })
    setCampaigns(prev => [copy, ...prev])
    setSelectedId(copy.id)
    setExpandedCampaigns(prev => new Set([...prev, copy.id]))
    flash('Campaign duplicated.')
  }

  const addAdSet = (campaignId) => {
    const s = makeAdSet({ name: `New Ad Set ${Date.now().toString().slice(-3)}` })
    setCampaigns(prev => prev.map(c => c.id === campaignId ? { ...c, adSets: [...c.adSets, s] } : c))
    setExpandedAdSets(prev => new Set([...prev, s.id]))
    flash('Ad set added.')
  }

  const duplicateAdSet = (campaignId, adSet) => {
    const copy = JSON.parse(JSON.stringify(adSet))
    copy.id = uid('adset')
    copy.name = `${adSet.name || 'Ad Set'} - Copy`
    copy.status = 'DRAFT'
    copy.ads.forEach(a => {
      a.id = uid('ad')
      a.name = `${a.name || 'Ad'} - Copy`
      a.status = 'DRAFT'
    })
    setCampaigns(prev => prev.map(c => c.id === campaignId ? { ...c, adSets: [...c.adSets, copy] } : c))
    setExpandedAdSets(prev => new Set([...prev, copy.id]))
    flash('Ad set duplicated.')
  }

  const addAd = (campaignId, adSetId) => {
    const a = makeAd({ name: `New Ad ${Date.now().toString().slice(-3)}` })
    setCampaigns(prev => prev.map(c => c.id !== campaignId ? c : ({
      ...c,
      adSets: c.adSets.map(s => s.id === adSetId ? { ...s, ads: [...s.ads, a] } : s)
    })))
    flash('Ad added.')
  }

  const duplicateAd = (campaignId, adSetId, ad) => {
    const copy = { ...JSON.parse(JSON.stringify(ad)), id: uid('ad'), name: `${ad.name || 'Ad'} - Copy`, status: 'DRAFT' }
    setCampaigns(prev => prev.map(c => c.id !== campaignId ? c : ({
      ...c,
      adSets: c.adSets.map(s => s.id === adSetId ? { ...s, ads: [...s.ads, copy] } : s)
    })))
    flash('Ad duplicated.')
  }

  const deleteAdSet = (campaignId, adSetId) => {
    setCampaigns(prev => prev.map(c => c.id === campaignId ? { ...c, adSets: c.adSets.filter(s => s.id !== adSetId) } : c))
    setSelectedAdSets(prev => prev.filter(id => id !== adSetId))
    flash('Ad set removed.')
  }

  const deleteAd = (campaignId, adSetId, adId) => {
    setCampaigns(prev => prev.map(c => c.id !== campaignId ? c : ({
      ...c,
      adSets: c.adSets.map(s => s.id !== adSetId ? s : { ...s, ads: s.ads.filter(a => a.id !== adId) })
    })))
    setSelectedAds(prev => prev.filter(id => id !== adId))
    flash('Ad removed.')
  }

  const toggleCampaignStatus = (campaign) => {
    const next = campaign.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE'
    const r = readiness(campaign)
    if (next === 'ACTIVE' && !r.ready) {
      setModal({ type: 'errors', title: 'Campaign is not ready', errors: r.errors })
      return
    }
    updateCampaign(campaign.id, { status: next })
    flash(`Campaign ${next === 'ACTIVE' ? 'activated' : 'paused'}.`)
  }

  const bulkApply = (field, value) => {
    if (bulkMode === 'ads') {
      setCampaigns(prev => prev.map(c => ({
        ...c,
        adSets: c.adSets.map(s => ({
          ...s,
          ads: s.ads.map(a => selectedAds.includes(a.id) ? { ...a, [field]: value } : a)
        }))
      })))
      flash(`${selectedAds.length} ads updated.`)
      setSelectedAds([])
    }
    if (bulkMode === 'adsets') {
      setCampaigns(prev => prev.map(c => ({
        ...c,
        adSets: c.adSets.map(s => selectedAdSets.includes(s.id) ? { ...s, [field]: value } : s)
      })))
      flash(`${selectedAdSets.length} ad sets updated.`)
      setSelectedAdSets([])
    }
    setBulkMode(null)
  }

  const totalStats = useMemo(() => {
    const adSets = campaigns.reduce((n, c) => n + c.adSets.length, 0)
    const ads = campaigns.reduce((n, c) => n + c.adSets.reduce((m, s) => m + s.ads.length, 0), 0)
    const ready = campaigns.filter(c => readiness(c).ready).length
    return { campaigns: campaigns.length, adSets, ads, ready }
  }, [campaigns])

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark"><Rocket size={19} /></div>
          <div>
            <strong>AdPilot</strong>
            <span>Campaign Manager</span>
          </div>
        </div>
        <div className="top-actions">
          <div className="workspace"><BriefcaseBusiness size={15}/> Demo Workspace <ChevronDown size={14}/></div>
          <button className="icon-btn" title="Notifications"><Bell size={18}/><span className="notification-dot"/></button>
          <div className="avatar">PB</div>
        </div>
      </header>

      <div className="body-shell">
        <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
          <button className="collapse-btn" onClick={() => setSidebarCollapsed(v => !v)} title="Toggle sidebar">
            {sidebarCollapsed ? <ChevronRight size={17}/> : <ChevronDown size={17}/>}
          </button>
          {!sidebarCollapsed && <>
            <div className="sidebar-title">Ads Center</div>
            <nav>
              <button className="nav-item active"><BarChart3 size={17}/> Campaigns</button>
              <button className="nav-item"><Activity size={17}/> Insights</button>
              <button className="nav-item"><Users size={17}/> Audiences</button>
              <button className="nav-item"><Settings2 size={17}/> Settings</button>
            </nav>
            <div className="sidebar-divider"/>
            <div className="sidebar-title">Workspace</div>
            <div className="mini-stat"><span>Campaigns</span><b>{totalStats.campaigns}</b></div>
            <div className="mini-stat"><span>Ad Sets</span><b>{totalStats.adSets}</b></div>
            <div className="mini-stat"><span>Ads</span><b>{totalStats.ads}</b></div>
            <div className="mini-stat"><span>Ready</span><b>{totalStats.ready}</b></div>
          </>}
        </aside>

        <main className="main">
          <div className="page-head">
            <div>
              <div className="eyebrow">CAMPAIGN MANAGEMENT</div>
              <h1>Campaigns</h1>
              <p>Create, validate, duplicate and bulk-edit your advertising structure.</p>
            </div>
            <button className="primary-btn" onClick={addCampaign}><Plus size={17}/> Create campaign</button>
          </div>

          <div className="toolbar">
            <div className="search"><Search size={17}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search campaigns..." /></div>
            <div className="toolbar-stats"><span><ShieldCheck size={15}/> {totalStats.ready} ready</span><span><Layers3 size={15}/> {totalStats.adSets} ad sets</span><span><Target size={15}/> {totalStats.ads} ads</span></div>
          </div>

          <div className="workspace-grid">
            <section className="tree-panel">
              <div className="panel-head"><span>Structure</span><span className="muted">{filteredCampaigns.length} campaigns</span></div>
              <div className="tree">
                {filteredCampaigns.length === 0 && <div className="empty-state">No campaigns found.</div>}
                {filteredCampaigns.map(c => {
                  const r = readiness(c)
                  const expanded = expandedCampaigns.has(c.id)
                  return (
                    <div className="tree-campaign" key={c.id}>
                      <div className={`tree-row campaign-row ${selectedId === c.id ? 'selected' : ''}`} onClick={() => setSelectedId(c.id)}>
                        <button className="chevron" onClick={(e) => { e.stopPropagation(); setExpandedCampaigns(prev => { const n = new Set(prev); n.has(c.id) ? n.delete(c.id) : n.add(c.id); return n })}}>
                          {expanded ? <ChevronDown size={15}/> : <ChevronRight size={15}/>}
                        </button>
                        <div className="tree-icon campaign"><BarChart3 size={15}/></div>
                        <div className="tree-label"><b>{c.name || 'Untitled campaign'}</b><small>{objectiveLabels[c.objective] || 'No objective'}</small></div>
                        <span className={`ready-dot ${r.ready ? 'ready' : 'not-ready'}`} title={r.ready ? 'Ready' : `${r.errors.length} issue(s)`}/>
                      </div>
                      {expanded && c.adSets.map(s => {
                        const sr = validateAdSet(s)
                        const sx = expandedAdSets.has(s.id)
                        return (
                          <div className="tree-nested" key={s.id}>
                            <div className="tree-row" onClick={() => setSelectedId(c.id)}>
                              <button className="chevron" onClick={(e) => { e.stopPropagation(); setExpandedAdSets(prev => { const n = new Set(prev); n.has(s.id) ? n.delete(s.id) : n.add(s.id); return n })}}>
                                {sx ? <ChevronDown size={14}/> : <ChevronRight size={14}/>}
                              </button>
                              <div className="tree-icon adset"><Users size={14}/></div>
                              <div className="tree-label"><b>{s.name || 'Untitled ad set'}</b><small>{s.ads.length} ads · ₹{Number(s.budget || 0).toLocaleString('en-IN')}</small></div>
                              <span className={`ready-dot ${sr.length ? 'not-ready' : 'ready'}`}/>
                            </div>
                            {sx && s.ads.map(a => (
                              <div className="tree-ad" key={a.id} onClick={() => setSelectedId(c.id)}>
                                <div className="tree-icon ad"><FileImage size={13}/></div>
                                <div className="tree-label"><b>{a.name || 'Untitled ad'}</b><small>{ctaLabels[a.cta] || 'No CTA'}</small></div>
                                <span className={statusClass(a.status)}>{statusLabel(a.status)}</span>
                              </div>
                            ))}
                          </div>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            </section>

            <section className="detail-panel">
              {!selectedCampaign ? (
                <div className="empty-detail"><Rocket size={38}/><h2>Create your first campaign</h2><p>Build a campaign, then add ad sets and ads.</p><button className="primary-btn" onClick={addCampaign}><Plus size={16}/> Create campaign</button></div>
              ) : (
                <CampaignEditor
                  campaign={selectedCampaign}
                  updateCampaign={updateCampaign}
                  addAdSet={addAdSet}
                  duplicateCampaign={duplicateCampaign}
                  toggleCampaignStatus={toggleCampaignStatus}
                  addAd={addAd}
                  duplicateAdSet={duplicateAdSet}
                  deleteAdSet={deleteAdSet}
                  updateAdSet={updateAdSet}
                  updateAd={updateAd}
                  duplicateAd={duplicateAd}
                  deleteAd={deleteAd}
                  selectedAds={selectedAds}
                  setSelectedAds={setSelectedAds}
                  selectedAdSets={selectedAdSets}
                  setSelectedAdSets={setSelectedAdSets}
                  setBulkMode={setBulkMode}
                  setModal={setModal}
                />
              )}
            </section>
          </div>
        </main>
      </div>

      {bulkMode && <BulkBar mode={bulkMode} selectedCount={bulkMode === 'ads' ? selectedAds.length : selectedAdSets.length} onApply={bulkApply} onClose={() => setBulkMode(null)} />}
      {modal?.type === 'errors' && <ErrorModal modal={modal} onClose={() => setModal(null)} />}
      {toast && <div className={`toast ${toast.type}`}><BadgeCheck size={17}/>{toast.message}</div>}
    </div>
  )
}

function CampaignEditor(props) {
  const {
    campaign, updateCampaign, addAdSet, duplicateCampaign, toggleCampaignStatus, addAd,
    duplicateAdSet, deleteAdSet, updateAdSet, updateAd, duplicateAd, deleteAd,
    selectedAds, setSelectedAds, selectedAdSets, setSelectedAdSets, setBulkMode, setModal
  } = props
  const r = readiness(campaign)

  const toggleAd = (id) => setSelectedAds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  const toggleAdSet = (id) => setSelectedAdSets(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

const handleCreative = (campaignId, adSetId, adId, file) => {
  if (!file) return

  if (!file.type.startsWith('image/')) {
    setModal({
      type: 'errors',
      title: 'Invalid creative',
      errors: ['Please upload an image file (PNG, JPG, WEBP, etc.).']
    })
    return
  }

  if (file.size > 5 * 1024 * 1024) {
    setModal({
      type: 'errors',
      title: 'Creative is too large',
      errors: ['Please choose an image under 5 MB for this prototype.']
    })
    return
  }

  const reader = new FileReader()

  reader.onload = () => {
    const image = new Image()

    image.onload = () => {
      const maxDimension = 1200

      const scale = Math.min(
        1,
        maxDimension / Math.max(image.width, image.height)
      )

      const canvas = document.createElement('canvas')

      canvas.width = Math.max(1, Math.round(image.width * scale))
      canvas.height = Math.max(1, Math.round(image.height * scale))

      const context = canvas.getContext('2d')

      context.drawImage(
        image,
        0,
        0,
        canvas.width,
        canvas.height
      )

      const compressedImage = canvas.toDataURL('image/jpeg', 0.72)

      updateAd(
        campaignId,
        adSetId,
        adId,
        {
          creative: compressedImage,
          creativeName: file.name
        }
      )
    }

    image.onerror = () => {
      setModal({
        type: 'errors',
        title: 'Image error',
        errors: ['The selected image could not be processed. Please try another image.']
      })
    }

    image.src = reader.result
  }

  reader.onerror = () => {
    setModal({
      type: 'errors',
      title: 'Upload error',
      errors: ['The image could not be read. Please try again.']
    })
  }

  reader.readAsDataURL(file)
}

  return (
    <div>
      <div className="detail-head">
        <div>
          <div className="breadcrumb"><span>Campaigns</span><ChevronRight size={13}/><b>{campaign.name || 'Untitled campaign'}</b></div>
          <div className="detail-title-row">
            <h2>{campaign.name || 'Untitled campaign'}</h2>
            <span className={statusClass(campaign.status)}>{statusLabel(campaign.status)}</span>
          </div>
        </div>
        <div className="head-actions">
          <button className="secondary-btn" onClick={() => duplicateCampaign(campaign)}><Copy size={15}/> Duplicate</button>
          <button className={campaign.status === 'ACTIVE' ? 'secondary-btn danger-text' : 'secondary-btn'} onClick={() => toggleCampaignStatus(campaign)}>
            {campaign.status === 'ACTIVE' ? <Pause size={15}/> : <Zap size={15}/>}
            {campaign.status === 'ACTIVE' ? 'Pause' : 'Activate'}
          </button>
          <button className="primary-btn" onClick={() => {
            if (!r.ready) setModal({ type: 'errors', title: 'Campaign is not ready to launch', errors: r.errors })
            else updateCampaign(campaign.id, { status: 'ACTIVE' })
          }}><Rocket size={15}/> Launch</button>
        </div>
      </div>

      <div className={`readiness ${r.ready ? 'readiness-good' : 'readiness-bad'}`}>
        {r.ready ? <ShieldCheck size={18}/> : <CircleAlert size={18}/>}
        <div><b>{r.ready ? 'Ready to launch' : `${r.errors.length} issue${r.errors.length === 1 ? '' : 's'} to fix`}</b><span>{r.ready ? 'All required campaign, ad set and ad fields are valid.' : 'Fix the highlighted requirements before activating this campaign.'}</span></div>
        {!r.ready && <button className="link-btn" onClick={() => setModal({ type: 'errors', title: 'Launch readiness issues', errors: r.errors })}>View issues</button>}
      </div>

      <div className="section-card">
        <div className="section-card-head"><div><span className="section-kicker">LEVEL 1</span><h3>Campaign</h3></div><BarChart3 size={19}/></div>
        <div className="form-grid">
          <Field label="Campaign name" required error={!campaign.name.trim() ? 'Campaign name is required.' : ''}>
            <input value={campaign.name} onChange={e => updateCampaign(campaign.id, { name: e.target.value })} placeholder="e.g. Summer Sale 2026" />
          </Field>
          <Field label="Objective" required error={!campaign.objective ? 'Objective is required.' : ''}>
            <select value={campaign.objective} onChange={e => updateCampaign(campaign.id, { objective: e.target.value })}>
              <option value="">Select objective</option>
              {Object.entries(objectiveLabels).map(([v,l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </Field>
          <Field label="Budget type" required>
            <select value={campaign.budgetType} onChange={e => updateCampaign(campaign.id, { budgetType: e.target.value })}><option value="DAILY">Daily</option><option value="LIFETIME">Lifetime</option></select>
          </Field>
          <Field label="Campaign budget (₹)" required error={Number(campaign.budget) <= 0 ? 'Budget must be greater than ₹0.' : ''}>
            <div className="input-icon"><DollarSign size={15}/><input type="number" min="0" value={campaign.budget} onChange={e => updateCampaign(campaign.id, { budget: e.target.value })}/></div>
          </Field>
          <Field label="Status">
            <select value={campaign.status} onChange={e => updateCampaign(campaign.id, { status: e.target.value })}><option value="DRAFT">Draft</option><option value="ACTIVE">Active</option><option value="PAUSED">Paused</option><option value="ARCHIVED">Archived</option></select>
          </Field>
        </div>
      </div>

      <div className="section-heading-row">
        <div><span className="section-kicker">LEVEL 2</span><h3>Ad sets <span>{campaign.adSets.length}</span></h3></div>
        <div className="section-actions">
          {selectedAdSets.length > 0 && <button className="secondary-btn" onClick={() => setBulkMode('adsets')}><Layers3 size={15}/> Bulk edit ({selectedAdSets.length})</button>}
          <button className="secondary-btn" onClick={() => addAdSet(campaign.id)}><Plus size={15}/> Add ad set</button>
        </div>
      </div>

      {campaign.adSets.map(s => {
        const errors = validateAdSet(s)
        return (
          <div className="entity-card" key={s.id}>
            <div className="entity-head">
              <div className="entity-title">
                <input type="checkbox" checked={selectedAdSets.includes(s.id)} onChange={() => toggleAdSet(s.id)} />
                <div className="entity-icon adset"><Users size={17}/></div>
                <div><h4>{s.name || 'Untitled ad set'}</h4><span>{s.ads.length} ads · {s.locations.length ? s.locations.join(', ') : 'No location'}</span></div>
              </div>
              <div className="entity-tools">
                <span className={errors.length ? 'mini-ready bad' : 'mini-ready good'}>{errors.length ? `${errors.length} issues` : 'Ready'}</span>
                <button className="icon-btn" onClick={() => duplicateAdSet(campaign.id, s)} title="Duplicate"><Copy size={16}/></button>
                <button className="icon-btn danger-icon" onClick={() => deleteAdSet(campaign.id, s.id)} title="Delete"><Trash2 size={16}/></button>
              </div>
            </div>
            <div className="form-grid compact">
              <Field label="Ad set name" required error={!s.name.trim() ? 'Ad set name is required.' : ''}><input value={s.name} onChange={e => updateAdSet(campaign.id, s.id, { name: e.target.value })}/></Field>
              <Field label="Locations" required error={!s.locations.length ? 'Add at least one location.' : ''}><input value={s.locations.join(', ')} onChange={e => updateAdSet(campaign.id, s.id, { locations: e.target.value.split(',').map(x => x.trim()).filter(Boolean) })} placeholder="Mumbai, Pune, Delhi"/></Field>
              <Field label="Age range"><div className="range-inputs"><input type="number" min="13" max="65" value={s.ageMin} onChange={e => updateAdSet(campaign.id, s.id, { ageMin: e.target.value })}/><span>to</span><input type="number" min="13" max="65" value={s.ageMax} onChange={e => updateAdSet(campaign.id, s.id, { ageMax: e.target.value })}/></div></Field>
              <Field label="Budget (₹)" required error={Number(s.budget) <= 0 ? 'Budget must be greater than ₹0.' : ''}><div className="input-icon"><DollarSign size={15}/><input type="number" min="0" value={s.budget} onChange={e => updateAdSet(campaign.id, s.id, { budget: e.target.value })}/></div></Field>
              <Field label="Start date" required><div className="input-icon"><CalendarDays size={15}/><input type="date" value={s.startDate} onChange={e => updateAdSet(campaign.id, s.id, { startDate: e.target.value })}/></div></Field>
              <Field label="End date"><div className="input-icon"><CalendarDays size={15}/><input type="date" value={s.endDate} onChange={e => updateAdSet(campaign.id, s.id, { endDate: e.target.value })}/></div></Field>
              <Field label="Status"><select value={s.status} onChange={e => updateAdSet(campaign.id, s.id, { status: e.target.value })}><option>DRAFT</option><option>ACTIVE</option><option>PAUSED</option><option>ARCHIVED</option></select></Field>
            </div>

            <div className="subsection-head">
              <div><span className="section-kicker">LEVEL 3</span><h4>Ads <span>{s.ads.length}</span></h4></div>
              <div className="section-actions">
                {selectedAds.length > 0 && <button className="secondary-btn" onClick={() => setBulkMode('ads')}><Layers3 size={15}/> Bulk edit ({selectedAds.length})</button>}
                <button className="secondary-btn" onClick={() => addAd(campaign.id, s.id)}><Plus size={15}/> Add ad</button>
              </div>
            </div>

            {s.ads.map(ad => {
              const ae = validateAd(ad)
              return (
                <div className="ad-card" key={ad.id}>
                  <div className="ad-card-head">
                    <div className="entity-title">
                      <input type="checkbox" checked={selectedAds.includes(ad.id)} onChange={() => toggleAd(ad.id)} />
                      <div className="entity-icon ad"><FileImage size={16}/></div>
                      <div><h4>{ad.name || 'Untitled ad'}</h4><span>{ctaLabels[ad.cta] || 'No CTA'} · {ad.creativeName || 'No creative'}</span></div>
                    </div>
                    <div className="entity-tools">
                      <span className={ae.length ? 'mini-ready bad' : 'mini-ready good'}>{ae.length ? `${ae.length} issues` : 'Ready'}</span>
                      <span className={statusClass(ad.status)}>{statusLabel(ad.status)}</span>
                      <button className="icon-btn" onClick={() => duplicateAd(campaign.id, s.id, ad)} title="Duplicate"><Copy size={16}/></button>
                      <button className="icon-btn danger-icon" onClick={() => deleteAd(campaign.id, s.id, ad.id)} title="Delete"><Trash2 size={16}/></button>
                    </div>
                  </div>

                  <div className="ad-grid">
                    <div className="creative-box">
                      {ad.creative ? <img src={ad.creative} alt={ad.creativeName || 'Ad creative'} /> : <div className="creative-empty"><FileImage size={27}/><b>Creative required</b><span>Upload an image up to 5 MB</span></div>}
                      <label className="upload-btn"><Upload size={15}/> {ad.creative ? 'Replace creative' : 'Upload creative'}<input type="file" accept="image/*" hidden onChange={e => handleCreative(campaign.id, s.id, ad.id, e.target.files?.[0])}/></label>
                    </div>
                    <div className="ad-fields">
                      <Field label="Ad name" required error={!ad.name.trim() ? 'Ad name is required.' : ''}><input value={ad.name} onChange={e => updateAd(campaign.id, s.id, ad.id, { name: e.target.value })}/></Field>
                      <Field label="Headline" required error={!ad.headline.trim() ? 'Headline is missing.' : ''}><input value={ad.headline} onChange={e => updateAd(campaign.id, s.id, ad.id, { headline: e.target.value })} placeholder="Your main ad headline"/></Field>
                      <Field label="Primary text" required error={!ad.primaryText.trim() ? 'Primary text is missing.' : ''}><textarea rows="3" value={ad.primaryText} onChange={e => updateAd(campaign.id, s.id, ad.id, { primaryText: e.target.value })} placeholder="Tell people why they should care..."/></Field>
                      <div className="form-grid two">
                        <Field label="CTA" required error={!ad.cta ? 'CTA is required.' : ''}><select value={ad.cta} onChange={e => updateAd(campaign.id, s.id, ad.id, { cta: e.target.value })}><option value="">Select CTA</option>{Object.entries(ctaLabels).map(([v,l]) => <option key={v} value={v}>{l}</option>)}</select></Field>
                        <Field label="Landing page URL" required error={!ad.landingPageUrl.trim() ? 'Landing page URL is required.' : ''}><div className="input-icon"><ExternalLink size={14}/><input value={ad.landingPageUrl} onChange={e => updateAd(campaign.id, s.id, ad.id, { landingPageUrl: e.target.value })} placeholder="https://example.com"/></div></Field>
                      </div>
                      <Field label="Status"><select value={ad.status} onChange={e => updateAd(campaign.id, s.id, ad.id, { status: e.target.value })}><option>DRAFT</option><option>ACTIVE</option><option>PAUSED</option><option>ARCHIVED</option></select></Field>
                    </div>
                  </div>
                  {ae.length > 0 && <div className="inline-errors"><CircleAlert size={16}/><div><b>Ad cannot be launched</b>{ae.map((e, i) => <span key={i}>• {e}</span>)}</div></div>}
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

function Field({ label, required, error, children }) {
  return <label className={`field ${error ? 'has-error' : ''}`}><span>{label}{required && <em>*</em>}</span>{children}{error && <small className="field-error"><CircleAlert size={12}/>{error}</small>}</label>
}

function BulkBar({ mode, selectedCount, onApply, onClose }) {
  const [field, setField] = useState(mode === 'ads' ? 'cta' : 'budget')
  const [value, setValue] = useState(mode === 'ads' ? 'SHOP_NOW' : '1000')
  return (
    <div className="bulk-bar">
      <div><b>{selectedCount}</b> {mode === 'ads' ? 'ads' : 'ad sets'} selected</div>
      <select value={field} onChange={e => setField(e.target.value)}>
        {mode === 'ads' ? <><option value="cta">CTA</option><option value="status">Status</option></> : <><option value="budget">Budget</option><option value="status">Status</option></>}
      </select>
      {field === 'cta' && <select value={value} onChange={e => setValue(e.target.value)}>{Object.entries(ctaLabels).map(([v,l]) => <option key={v} value={v}>{l}</option>)}</select>}
      {field === 'status' && <select value={value} onChange={e => setValue(e.target.value)}><option value="DRAFT">Draft</option><option value="ACTIVE">Active</option><option value="PAUSED">Paused</option><option value="ARCHIVED">Archived</option></select>}
      {field === 'budget' && <div className="bulk-input"><DollarSign size={14}/><input type="number" min="0" value={value} onChange={e => setValue(e.target.value)}/></div>}
      <button className="primary-btn" onClick={() => onApply(field, value)}>Apply changes</button>
      <button className="icon-btn on-dark" onClick={onClose}><X size={18}/></button>
    </div>
  )
}

function ErrorModal({ modal, onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-icon"><CircleAlert size={23}/></div>
        <h3>{modal.title}</h3>
        <p>The application blocked the action until these issues are fixed:</p>
        <ul>{modal.errors.map((e, i) => <li key={i}>{e}</li>)}</ul>
        <button className="primary-btn full" onClick={onClose}>Got it</button>
      </div>
    </div>
  )
}

createRoot(document.getElementById('root')).render(<App />)
