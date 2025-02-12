import { CreditCard, DollarSign, FileText, Download } from 'lucide-react';

export default function Fees() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <CreditCard className="h-6 w-6 text-blue-500 mr-2" />
          <h1 className="text-2xl font-semibold text-gray-900">Fees</h1>
        </div>
        <div className="flex space-x-3">
          <button className="btn-secondary flex items-center">
            <Download className="h-5 w-5 mr-1" />
            Download Statement
          </button>
          <button className="btn-primary flex items-center">
            <DollarSign className="h-5 w-5 mr-1" />
            Pay Fees
          </button>
        </div>
      </div>

      {/* Fee Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Total Due</h3>
            <DollarSign className="h-5 w-5 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">₹0.00</p>
          <p className="text-sm text-gray-500 mt-1">Due by: --/--/----</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Last Payment</h3>
            <CreditCard className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">₹0.00</p>
          <p className="text-sm text-gray-500 mt-1">Paid on: --/--/----</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Payment History</h3>
            <FileText className="h-5 w-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">0</p>
          <p className="text-sm text-gray-500 mt-1">Total transactions</p>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Transactions</h3>
        <p className="text-gray-500 text-center py-8">
          Transaction history coming soon...
        </p>
      </div>
    </div>
  );
}
