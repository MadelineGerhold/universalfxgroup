"use client";
import React, { useState } from "react";
import AdminSettings from "../../../components/admin/AdminSettings/AdminSettings";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import { Settings, Shield } from "lucide-react";

export default function VerificationPage() {
  const [activeTab, setActiveTab] = useState("settings");

  return (
    <div className="space-y-6">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Verification & Settings
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Manage verification and system settings
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger
            value="settings"
            className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
          >
            <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Settings</span>
            <span className="sm:hidden">Settings</span>
          </TabsTrigger>
          <TabsTrigger
            value="overview"
            className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
          >
            <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Overview</span>
            <span className="sm:hidden">Overview</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-6">
          <AdminSettings />
        </TabsContent>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Approved Today
                  </p>
                  <p className="text-2xl font-bold text-gray-900">-</p>
                </div>
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
