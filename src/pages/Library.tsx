import { useState } from 'react';
import { wallpapers } from '../data/store';
import { Wallpaper } from '../types';
import {
  Search,
  Grid3X3,
  List,
  Heart,
  Star,
  Filter,
  Play,
  Image,
  Film,
  Code,
  Sparkles,
} from 'lucide-react';

export default function Library() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(null);

  const filteredWallpapers = wallpapers.filter(wp => {
    const matchesSearch = wp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wp.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = filterType === 'all' || wp.type === filterType;
    return matchesSearch && matchesType;
  });

  const typeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Film size={12} className="text-hypr-cyan" />;
      case 'shader': return <Code size={12} className="text-hypr-yellow" />;
      case 'animated': return <Sparkles size={12} className="text-hypr-accent" />;
      default: return <Image size={12} className="text-hypr-green" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-hypr-text">Wallpaper Library</h2>
          <p className="text-sm text-hypr-text-muted mt-1">{wallpapers.length} wallpapers in collection</p>
        </div>
        <button className="px-4 py-2 bg-hypr-accent hover:bg-hypr-accent-dim text-white rounded-lg text-sm font-medium transition-colors">
          + Add Wallpaper
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex-1 min-w-64 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-hypr-text-muted" />
          <input
            type="text"
            placeholder="Search wallpapers by name or tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-hypr-surface border border-hypr-border rounded-lg text-sm text-hypr-text placeholder:text-hypr-text-muted focus:outline-none focus:border-hypr-accent/50 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1 bg-hypr-surface border border-hypr-border rounded-lg p-1">
          {['all', 'image', 'video', 'shader'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                filterType === type
                  ? 'bg-hypr-accent/20 text-hypr-accent-light'
                  : 'text-hypr-text-dim hover:text-hypr-text'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 bg-hypr-surface border border-hypr-border rounded-lg p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-hypr-accent/20 text-hypr-accent-light' : 'text-hypr-text-dim'}`}
          >
            <Grid3X3 size={16} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-hypr-accent/20 text-hypr-accent-light' : 'text-hypr-text-dim'}`}
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Results count */}
      <p className="text-xs text-hypr-text-muted">
        Showing {filteredWallpapers.length} of {wallpapers.length} wallpapers
      </p>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredWallpapers.map(wp => (
            <div
              key={wp.id}
              onClick={() => setSelectedWallpaper(wp)}
              className="wallpaper-card bg-hypr-surface border border-hypr-border rounded-xl overflow-hidden cursor-pointer group"
            >
              {/* Thumbnail */}
              <div
                className="aspect-video relative flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${wp.color || '#1a1a25'}, ${wp.color || '#1a1a25'}cc)` }}
              >
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <Play size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-sm">
                  {typeIcon(wp.type)}
                  <span className="text-[10px] text-white/80">{wp.type}</span>
                </div>
                {wp.isFavorite && (
                  <div className="absolute top-2 right-2">
                    <Heart size={14} className="text-hypr-red fill-hypr-red" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-3">
                <h4 className="text-sm font-medium text-hypr-text truncate">{wp.name}</h4>
                <p className="text-xs text-hypr-text-muted mt-1">{wp.resolution} • {wp.fileSize}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {wp.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-hypr-surface-3 text-hypr-text-muted">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="space-y-2">
          {filteredWallpapers.map(wp => (
            <div
              key={wp.id}
              onClick={() => setSelectedWallpaper(wp)}
              className="flex items-center gap-4 p-3 bg-hypr-surface border border-hypr-border rounded-lg cursor-pointer hover:border-hypr-accent/30 transition-colors"
            >
              <div
                className="w-16 h-10 rounded flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${wp.color || '#1a1a25'}, ${wp.color || '#1a1a25'}cc)` }}
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-hypr-text truncate">{wp.name}</h4>
                <p className="text-xs text-hypr-text-muted truncate">{wp.path}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded bg-hypr-surface-3 text-hypr-text-muted">{wp.type}</span>
                <span className="text-xs text-hypr-text-muted">{wp.resolution}</span>
                {wp.isFavorite && <Heart size={14} className="text-hypr-red fill-hypr-red" />}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedWallpaper && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedWallpaper(null)}>
          <div className="bg-hypr-surface border border-hypr-border rounded-2xl max-w-lg w-full p-6" onClick={e => e.stopPropagation()}>
            <div
              className="aspect-video rounded-lg mb-4 flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${selectedWallpaper.color || '#1a1a25'}, ${selectedWallpaper.color || '#1a1a25'}cc)` }}
            >
              <span className="text-hypr-text-muted">{selectedWallpaper.type === 'video' ? '▶ Video Wallpaper' : '🖼 Static Wallpaper'}</span>
            </div>
            <h3 className="text-lg font-bold text-hypr-text">{selectedWallpaper.name}</h3>
            <p className="text-sm text-hypr-text-dim mt-1 font-mono">{selectedWallpaper.path}</p>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-hypr-surface-2 rounded-lg p-3">
                <p className="text-xs text-hypr-text-muted">Type</p>
                <p className="text-sm font-medium text-hypr-text capitalize">{selectedWallpaper.type}</p>
              </div>
              <div className="bg-hypr-surface-2 rounded-lg p-3">
                <p className="text-xs text-hypr-text-muted">Resolution</p>
                <p className="text-sm font-medium text-hypr-text">{selectedWallpaper.resolution}</p>
              </div>
              <div className="bg-hypr-surface-2 rounded-lg p-3">
                <p className="text-xs text-hypr-text-muted">File Size</p>
                <p className="text-sm font-medium text-hypr-text">{selectedWallpaper.fileSize}</p>
              </div>
              <div className="bg-hypr-surface-2 rounded-lg p-3">
                <p className="text-xs text-hypr-text-muted">Added</p>
                <p className="text-sm font-medium text-hypr-text">{selectedWallpaper.addedAt}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-4">
              {selectedWallpaper.tags.map(tag => (
                <span key={tag} className="text-xs px-2 py-1 rounded-full bg-hypr-accent/10 text-hypr-accent-light border border-hypr-accent/20">
                  #{tag}
                </span>
              ))}
            </div>
            <div className="flex gap-2 mt-5">
              <button className="flex-1 px-4 py-2.5 bg-hypr-accent hover:bg-hypr-accent-dim text-white rounded-lg text-sm font-medium transition-colors">
                Set as Wallpaper
              </button>
              <button className="px-4 py-2.5 bg-hypr-surface-2 hover:bg-hypr-surface-3 border border-hypr-border rounded-lg text-sm text-hypr-text-dim transition-colors">
                <Star size={16} />
              </button>
              <button onClick={() => setSelectedWallpaper(null)} className="px-4 py-2.5 bg-hypr-surface-2 hover:bg-hypr-surface-3 border border-hypr-border rounded-lg text-sm text-hypr-text-dim transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
