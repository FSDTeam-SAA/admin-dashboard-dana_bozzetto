'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Upload, File, Download, Trash2 } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedBy: string;
  uploadedDate: string;
  project: string;
}

const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'Floor Plans Rev. 3.pdf',
    type: 'PDF',
    size: '2.4 MB',
    uploadedBy: 'Sarah Mitchell',
    uploadedDate: 'Nov 20, 2025',
    project: 'Modern Villa Design',
  },
  {
    id: '2',
    name: 'Elevation Drawings.dwg',
    type: 'DWG',
    size: '3.1 MB',
    uploadedBy: 'John Anderson',
    uploadedDate: 'Nov 18, 2025',
    project: 'Downtown Office',
  },
  {
    id: '3',
    name: 'Budget Estimate.xlsx',
    type: 'Excel',
    size: '1.2 MB',
    uploadedBy: 'Admin',
    uploadedDate: 'Nov 15, 2025',
    project: 'Central Tower',
  },
  {
    id: '4',
    name: 'Contract Agreement.docx',
    type: 'Word',
    size: '890 KB',
    uploadedBy: 'Legal Team',
    uploadedDate: 'Nov 10, 2025',
    project: 'Riverside Project',
  },
];

const fileIcons: Record<string, string> = {
  PDF: '📄',
  DWG: '📐',
  Excel: '📊',
  Word: '📝',
};

export default function DocumentsPage() {
  const [documents, setDocuments] = useState(mockDocuments);
  const [search, setSearch] = useState('');

  const filteredDocuments = documents.filter((doc) =>
    doc.name.toLowerCase().includes(search.toLowerCase()) ||
    doc.project.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Documents</h1>
          <p className="text-slate-400">Manage project documents and files</p>
        </div>
        <Button className="bg-teal-600 hover:bg-teal-700 text-white gap-2">
          <Upload className="w-4 h-4" />
          Upload Document
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <Input
          type="text"
          placeholder="Search documents..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
        />
      </div>

      {/* Documents Table */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
        {filteredDocuments.length === 0 ? (
          <div className="p-12 text-center">
            <File className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-400">No documents found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700 border-b border-slate-600">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                    Document Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                    Size
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                    Project
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                    Uploaded By
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredDocuments.map((doc) => (
                  <tr
                    key={doc.id}
                    className="hover:bg-slate-700 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">
                          {fileIcons[doc.type] || '📄'}
                        </span>
                        <span className="text-white font-medium">{doc.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-300">{doc.type}</td>
                    <td className="px-6 py-4 text-slate-300">{doc.size}</td>
                    <td className="px-6 py-4 text-slate-300">{doc.project}</td>
                    <td className="px-6 py-4 text-slate-300">{doc.uploadedBy}</td>
                    <td className="px-6 py-4 text-slate-400">{doc.uploadedDate}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-slate-400 hover:text-teal-400 hover:bg-slate-700 rounded transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(doc.id)}
                          className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
