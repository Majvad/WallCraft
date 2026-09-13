import { useState } from 'react';
import { playlists, wallpapers } from '../data/store';
import { Playlist } from '../types';
import {
  ListMusic,
  Play,
  Pause,
  Shuffle,
  ArrowRightLeft,
  Clock,
  Plus,
  Trash2,
  GripVertical,
  ChevronRight,
} from 'lucide-react';

export default function Playlists() {
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(playlists[0] || null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const modeIcon = (mode: string) => {
    switch (mode) {
      case 'sequential': return <ArrowRightLeft size={14} />;
      case 'random': return <Shuffle size={14} />;
      case 'shuffle': return <Shuffle size={14} />;
      default: return <ArrowRightLeft size={14} />;
    }
  };

  const formatInterval = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-hypr-text">Playlists</h2>
          <p className="text-sm text-hypr-text-muted mt-1">Manage wallpaper rotation and playlists</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-hypr-accent hover:bg-hypr-accent-dim text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <Plus size={16} />
          New Playlist
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Playlist List */}
        <div className="lg:col-span-1 space-y-3">
          {playlists.map(playlist => (
            <div
              key={playlist.id}
              onClick={() => setSelectedPlaylist(playlist)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selectedPlaylist?.id === playlist.id
                  ? 'bg-hypr-accent/5 border-hypr-accent/30 glow-accent'
                  : 'bg-hypr-surface border-hypr-border hover:border-hypr-text-muted'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <ListMusic size={16} className={playlist.isActive ? 'text-hypr-green' : 'text-hypr-text-muted'} />
                  <h4 className="font-medium text-hypr-text">{playlist.name}</h4>
                </div>
                {playlist.isActive && (
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-hypr-green/10 border border-hypr-green/30">
                    <div className="w-1.5 h-1.5 rounded-full bg-hypr-green animate-pulse-dot"></div>
                    <span className="text-[10px] text-hypr-green">Active</span>
                  </div>
                )}
              </div>
              <p className="text-xs text-hypr-text-dim mb-3">{playlist.description}</p>
              <div className="flex items-center justify-between text-xs text-hypr-text-muted">
                <span>{playlist.wallpapers.length} wallpapers</span>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1">
                    {modeIcon(playlist.mode)}
                    {playlist.mode}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {formatInterval(playlist.interval)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Playlist Details */}
        <div className="lg:col-span-2">
          {selectedPlaylist ? (
            <div className="bg-hypr-surface border border-hypr-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-lg font-bold text-hypr-text">{selectedPlaylist.name}</h3>
                  <p className="text-sm text-hypr-text-dim">{selectedPlaylist.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className={`p-2 rounded-lg border transition-colors ${
                    selectedPlaylist.isActive
                      ? 'bg-hypr-green/10 border-hypr-green/30 text-hypr-green'
                      : 'bg-hypr-surface-2 border-hypr-border text-hypr-text-dim hover:text-hypr-text'
                  }`}>
                    {selectedPlaylist.isActive ? <Pause size={16} /> : <Play size={16} />}
                  </button>
                  <button className="p-2 rounded-lg bg-hypr-surface-2 border border-hypr-border text-hypr-text-dim hover:text-hypr-red transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Playlist Settings */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-hypr-surface-2 rounded-lg p-3">
                  <p className="text-xs text-hypr-text-muted mb-1">Mode</p>
                  <div className="flex items-center gap-2">
                    {modeIcon(selectedPlaylist.mode)}
                    <select className="bg-transparent text-sm text-hypr-text focus:outline-none">
                      <option value="sequential" selected={selectedPlaylist.mode === 'sequential'}>Sequential</option>
                      <option value="random" selected={selectedPlaylist.mode === 'random'}>Random</option>
                      <option value="shuffle" selected={selectedPlaylist.mode === 'shuffle'}>Shuffle</option>
                    </select>
                  </div>
                </div>
                <div className="bg-hypr-surface-2 rounded-lg p-3">
                  <p className="text-xs text-hypr-text-muted mb-1">Interval</p>
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-hypr-text-muted" />
                    <span className="text-sm text-hypr-text">{formatInterval(selectedPlaylist.interval)}</span>
                  </div>
                </div>
              </div>

              {/* Wallpaper Queue */}
              <h4 className="text-sm font-medium text-hypr-text mb-3 flex items-center gap-2">
                <GripVertical size={14} className="text-hypr-text-muted" />
                Wallpaper Queue ({selectedPlaylist.wallpapers.length})
              </h4>
              <div className="space-y-2">
                {selectedPlaylist.wallpapers.map((wp, index) => (
                  <div
                    key={wp.id}
                    className="flex items-center gap-3 p-3 bg-hypr-surface-2 rounded-lg border border-hypr-border/50 hover:border-hypr-border transition-colors"
                  >
                    <span className="text-xs font-mono text-hypr-text-muted w-6 text-center">{index + 1}</span>
                    <div
                      className="w-14 h-9 rounded flex-shrink-0"
                      style={{ background: `linear-gradient(135deg, ${wp.color || '#1a1a25'}, ${wp.color || '#1a1a25'}cc)` }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-hypr-text truncate">{wp.name}</p>
                      <p className="text-xs text-hypr-text-muted">{wp.type} • {wp.resolution}</p>
                    </div>
                    <ChevronRight size={14} className="text-hypr-text-muted" />
                  </div>
                ))}
              </div>

              {/* Add Wallpaper */}
              <button className="w-full mt-3 p-3 border border-dashed border-hypr-border rounded-lg text-sm text-hypr-text-muted hover:border-hypr-accent/50 hover:text-hypr-accent transition-colors flex items-center justify-center gap-2">
                <Plus size={14} />
                Add Wallpaper to Playlist
              </button>
            </div>
          ) : (
            <div className="bg-hypr-surface border border-hypr-border rounded-xl p-12 flex flex-col items-center justify-center">
              <ListMusic size={48} className="text-hypr-text-muted mb-4" />
              <p className="text-hypr-text-dim">Select a playlist to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Playlist Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowCreateModal(false)}>
          <div className="bg-hypr-surface border border-hypr-border rounded-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-hypr-text mb-4">Create New Playlist</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-hypr-text-dim block mb-1">Name</label>
                <input type="text" placeholder="Playlist name..." className="w-full px-3 py-2 bg-hypr-surface-2 border border-hypr-border rounded-lg text-sm text-hypr-text placeholder:text-hypr-text-muted focus:outline-none focus:border-hypr-accent/50" />
              </div>
              <div>
                <label className="text-sm text-hypr-text-dim block mb-1">Description</label>
                <input type="text" placeholder="Description..." className="w-full px-3 py-2 bg-hypr-surface-2 border border-hypr-border rounded-lg text-sm text-hypr-text placeholder:text-hypr-text-muted focus:outline-none focus:border-hypr-accent/50" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-hypr-text-dim block mb-1">Mode</label>
                  <select className="w-full px-3 py-2 bg-hypr-surface-2 border border-hypr-border rounded-lg text-sm text-hypr-text focus:outline-none focus:border-hypr-accent/50">
                    <option value="sequential">Sequential</option>
                    <option value="random">Random</option>
                    <option value="shuffle">Shuffle</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-hypr-text-dim block mb-1">Interval</label>
                  <select className="w-full px-3 py-2 bg-hypr-surface-2 border border-hypr-border rounded-lg text-sm text-hypr-text focus:outline-none focus:border-hypr-accent/50">
                    <option value="300">5 minutes</option>
                    <option value="900">15 minutes</option>
                    <option value="1800">30 minutes</option>
                    <option value="3600">1 hour</option>
                    <option value="7200">2 hours</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button onClick={() => setShowCreateModal(false)} className="flex-1 px-4 py-2.5 bg-hypr-accent hover:bg-hypr-accent-dim text-white rounded-lg text-sm font-medium transition-colors">
                Create Playlist
              </button>
              <button onClick={() => setShowCreateModal(false)} className="px-4 py-2.5 bg-hypr-surface-2 border border-hypr-border rounded-lg text-sm text-hypr-text-dim transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
