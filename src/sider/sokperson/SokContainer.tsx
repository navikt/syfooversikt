import React from 'react';
import { NavigationBar } from '@/components/NavigationBar';
import SokPerson from '@/sider/sokperson/SokPerson';

export default function SokContainer() {
  return (
    <div className="flex flex-col mx-8">
      <NavigationBar />
      <SokPerson />
    </div>
  );
}
