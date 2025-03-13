
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

const teamMembers = [
  {
    id: '1',
    name: 'Ana Silva',
    role: 'Investment Partner',
    email: 'ana@scventures.com',
    avatar: null,
    initials: 'AS',
    assignedStartups: 12
  },
  {
    id: '2',
    name: 'Carlos Mendes',
    role: 'Managing Partner',
    email: 'carlos@scventures.com',
    avatar: null,
    initials: 'CM',
    assignedStartups: 8
  },
  {
    id: '3',
    name: 'Juliana Costa',
    role: 'Analyst',
    email: 'juliana@scventures.com',
    avatar: null,
    initials: 'JC',
    assignedStartups: 15
  },
  {
    id: '4',
    name: 'Rafael Santos',
    role: 'Venture Partner',
    email: 'rafael@scventures.com',
    avatar: null,
    initials: 'RS',
    assignedStartups: 6
  },
  {
    id: '5',
    name: 'Mariana Oliveira',
    role: 'Investment Associate',
    email: 'mariana@scventures.com',
    avatar: null,
    initials: 'MO',
    assignedStartups: 10
  }
];

const Team = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Team</h1>
          <p className="text-muted-foreground">Manage team members and access permissions</p>
        </div>
        <Button className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Add Team Member
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teamMembers.map(member => (
          <Card key={member.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={member.avatar || ''} alt={member.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {member.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <Badge variant="outline" className="mt-1">{member.role}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Email:</span>
                  <span>{member.email}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Assigned startups:</span>
                  <span className="font-medium">{member.assignedStartups}</span>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1">Edit</Button>
                  <Button variant="outline" size="sm" className="flex-1 text-muted-foreground">Permissions</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Team;
