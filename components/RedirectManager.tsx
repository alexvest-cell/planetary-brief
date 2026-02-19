import React, { useState, useEffect } from 'react';
import { ArrowRight, Trash2, Edit, Save, Plus, X, ToggleLeft, ToggleRight, AlertCircle } from 'lucide-react';

interface Redirect {
    _id: string;
    fromPath: string;
    toPath: string;
    redirectType: 301 | 302;
    isActive: boolean;
    description: string;
    createdAt: string;
    updatedAt: string;
}

interface RedirectManagerProps {
    authToken: string | null;
}

const RedirectManager: React.FC<RedirectManagerProps> = ({ authToken }) => {
    const [redirects, setRedirects] = useState<Redirect[]>([]);
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState<string>('');

    const [formData, setFormData] = useState({
        fromPath: '',
        toPath: '',
        redirectType: 301 as 301 | 302,
        description: '',
        isActive: true
    });

    const getAuthHeaders = () => ({
        'Content-Type': 'application/json',
        ...(authToken && { 'Authorization': `Bearer ${authToken}` })
    });

    const loadRedirects = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/redirects', {
                headers: getAuthHeaders()
            });

            if (res.ok) {
                const data = await res.json();
                setRedirects(data);
            } else {
                const errorData = await res.json();
                setError(errorData.error || 'Failed to load redirects');
            }
        } catch (err: any) {
            setError(err.message || 'Failed to load redirects');
            console.error('Load redirects error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRedirects();
    }, []);

    const resetForm = () => {
        setFormData({
            fromPath: '',
            toPath: '',
            redirectType: 301,
            description: '',
            isActive: true
        });
        setEditingId(null);
        setShowForm(false);
        setError('');
    };

    const handleEdit = (redirect: Redirect) => {
        setFormData({
            fromPath: redirect.fromPath,
            toPath: redirect.toPath,
            redirectType: redirect.redirectType,
            description: redirect.description || '',
            isActive: redirect.isActive
        });
        setEditingId(redirect._id);
        setShowForm(true);
        setError('');
    };

    const handleSave = async () => {
        setError('');

        // Validation
        if (!formData.fromPath || !formData.toPath) {
            setError('Both From Path and To Path are required');
            return;
        }

        if (!formData.fromPath.startsWith('/')) {
            setError('From Path must start with /');
            return;
        }

        if (!formData.toPath.startsWith('/') && !formData.toPath.startsWith('http')) {
            setError('To Path must start with / or be a full URL');
            return;
        }

        setLoading(true);
        try {
            const url = editingId ? `/api/redirects/${editingId}` : '/api/redirects';
            const method = editingId ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: getAuthHeaders(),
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                await loadRedirects();
                resetForm();
            } else {
                const errorData = await res.json();
                setError(errorData.error || 'Failed to save redirect');
            }
        } catch (err: any) {
            setError(err.message || 'Failed to save redirect');
            console.error('Save redirect error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this redirect?')) {
            return;
        }

        setLoading(true);
        setError('');
        try {
            const res = await fetch(`/api/redirects/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });

            if (res.ok) {
                await loadRedirects();
            } else {
                const errorData = await res.json();
                setError(errorData.error || 'Failed to delete redirect');
            }
        } catch (err: any) {
            setError(err.message || 'Failed to delete redirect');
            console.error('Delete redirect error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleActive = async (redirect: Redirect) => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`/api/redirects/${redirect._id}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify({ isActive: !redirect.isActive })
            });

            if (res.ok) {
                await loadRedirects();
            } else {
                const errorData = await res.json();
                setError(errorData.error || 'Failed to toggle redirect');
            }
        } catch (err: any) {
            setError(err.message || 'Failed to toggle redirect');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-white p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-serif font-bold mb-2">301 Redirect Manager</h1>
                        <p className="text-gray-400 text-sm">Manage URL redirects for SEO and content migration</p>
                    </div>
                    <button
                        onClick={() => {
                            setShowForm(!showForm);
                            if (showForm) resetForm();
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold uppercase text-xs tracking-wider transition-colors"
                    >
                        {showForm ? <X size={16} /> : <Plus size={16} />}
                        {showForm ? 'Cancel' : 'New Redirect'}
                    </button>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-start gap-3">
                        <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                        <div className="flex-grow">
                            <p className="text-red-400 text-sm">{error}</p>
                        </div>
                        <button onClick={() => setError('')} className="text-red-400 hover:text-red-300">
                            <X size={16} />
                        </button>
                    </div>
                )}

                {/* Form */}
                {showForm && (
                    <div className="mb-8 p-6 bg-zinc-900/60 border border-white/10 rounded-lg">
                        <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Redirect' : 'Create New Redirect'}</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2 font-bold">
                                    From Path <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.fromPath}
                                    onChange={(e) => setFormData({ ...formData, fromPath: e.target.value })}
                                    placeholder="/old-article-url"
                                    className="w-full px-3 py-2 bg-zinc-950 border border-white/20 rounded text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none"
                                />
                                <p className="text-xs text-gray-500 mt-1">Must start with /</p>
                            </div>

                            <div>
                                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2 font-bold">
                                    To Path <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.toPath}
                                    onChange={(e) => setFormData({ ...formData, toPath: e.target.value })}
                                    placeholder="/new-article-url"
                                    className="w-full px-3 py-2 bg-zinc-950 border border-white/20 rounded text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none"
                                />
                                <p className="text-xs text-gray-500 mt-1">Start with / or full URL</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2 font-bold">
                                    Redirect Type
                                </label>
                                <select
                                    value={formData.redirectType}
                                    onChange={(e) => setFormData({ ...formData, redirectType: parseInt(e.target.value) as 301 | 302 })}
                                    className="w-full px-3 py-2 bg-zinc-950 border border-white/20 rounded text-white focus:border-emerald-500 focus:outline-none"
                                >
                                    <option value={301}>301 Permanent</option>
                                    <option value={302}>302 Temporary</option>
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2 font-bold">
                                    Description (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Why this redirect exists..."
                                    className="w-full px-3 py-2 bg-zinc-950 border border-white/20 rounded text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="w-4 h-4 bg-zinc-950 border border-white/20 rounded text-emerald-500 focus:ring-emerald-500"
                                />
                                <span className="text-sm text-gray-300">Active (redirect will be applied immediately)</span>
                            </label>
                        </div>

                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-600 text-white rounded-lg font-bold uppercase text-xs tracking-wider transition-colors"
                        >
                            <Save size={16} />
                            {loading ? 'Saving...' : (editingId ? 'Update' : 'Create')}
                        </button>
                    </div>
                )}

                {/* Redirects List */}
                <div className="bg-zinc-900/60 border border-white/10 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10 bg-black/20">
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-400">From</th>
                                    <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-gray-400">→</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-400">To</th>
                                    <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-gray-400">Type</th>
                                    <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-gray-400">Status</th>
                                    <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-gray-400">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading && redirects.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                                            Loading redirects...
                                        </td>
                                    </tr>
                                ) : redirects.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                                            No redirects configured. Click "New Redirect" to create one.
                                        </td>
                                    </tr>
                                ) : (
                                    redirects.map((redirect) => (
                                        <tr key={redirect._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                            <td className="px-4 py-3">
                                                <code className="text-sm text-blue-400 font-mono">{redirect.fromPath}</code>
                                                {redirect.description && (
                                                    <p className="text-xs text-gray-500 mt-1">{redirect.description}</p>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <ArrowRight size={16} className="mx-auto text-gray-400" />
                                            </td>
                                            <td className="px-4 py-3">
                                                <code className="text-sm text-emerald-400 font-mono break-all">{redirect.toPath}</code>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${redirect.redirectType === 301
                                                        ? 'bg-blue-500/20 text-blue-400'
                                                        : 'bg-yellow-500/20 text-yellow-400'
                                                    }`}>
                                                    {redirect.redirectType}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <button
                                                    onClick={() => handleToggleActive(redirect)}
                                                    className="inline-flex items-center gap-1 text-xs"
                                                >
                                                    {redirect.isActive ? (
                                                        <>
                                                            <ToggleRight size={20} className="text-emerald-500" />
                                                            <span className="text-emerald-400 font-bold">Active</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <ToggleLeft size={20} className="text-gray-500" />
                                                            <span className="text-gray-500 font-bold">Inactive</span>
                                                        </>
                                                    )}
                                                </button>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEdit(redirect)}
                                                        className="p-2 hover:bg-white/10 rounded transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit size={16} className="text-gray-400 hover:text-white" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(redirect._id)}
                                                        className="p-2 hover:bg-red-500/20 rounded transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={16} className="text-gray-400 hover:text-red-400" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer Info */}
                {redirects.length > 0 && (
                    <div className="mt-4 text-center text-xs text-gray-500">
                        {redirects.length} redirect{redirects.length !== 1 ? 's' : ''} configured · {redirects.filter(r => r.isActive).length} active
                    </div>
                )}
            </div>
        </div>
    );
};

export default RedirectManager;
