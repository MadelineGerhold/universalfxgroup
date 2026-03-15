"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Settings } from "lucide-react";

export default function AdminSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Admin Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">
          No additional settings to configure at this time.
        </p>
      </CardContent>
    </Card>
  );
}
