
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone, MapPin, Briefcase, Calendar } from 'lucide-react';

interface ProfilePageProps {
  role: 'student' | 'admin' | 'mentor';
}

const ProfilePage: React.FC<ProfilePageProps> = ({ role }) => {
  // Mock data - in a real app, fetch this from your auth context or API
  const user = {
    name: "Alex Johnson",
    email: "alex@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, Anytown, USA",
    bio: "Passionate about learning and helping others succeed. I enjoy solving complex problems and sharing knowledge.",
    role: role,
    joinDate: "August 15, 2023",
    avatar: "",
    website: "https://alexjohnson.dev",
    socialLinks: {
      twitter: "@alexjohnson",
      linkedin: "alexjohnson",
      github: "alexjohnson"
    }
  };

  // Role-specific additional info
  const getRoleSpecificInfo = () => {
    switch (role) {
      case 'student':
        return {
          title: "Student",
          field: "Computer Science",
          enrollmentDate: "January 2023",
          completedCourses: 12
        };
      case 'admin':
        return {
          title: "System Administrator",
          department: "Technical Operations",
          adminSince: "March 2022",
          permissionLevel: "Full Access"
        };
      case 'mentor':
        return {
          title: "Senior Mentor",
          specialization: "Full Stack Development",
          mentorSince: "June 2022",
          studentsSupported: 85
        };
      default:
        return {};
    }
  };

  const roleInfo = getRoleSpecificInfo();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Your Profile</h1>
        <p className="text-muted-foreground">View and update your profile information</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Summary Card */}
        <Card className="md:col-span-1 card-shadow">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="w-24 h-24">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle>{user.name}</CardTitle>
            <CardDescription className="flex items-center justify-center gap-1 mt-1">
              <Briefcase className="h-3 w-3" />
              <span>{roleInfo.title}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{user.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{user.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{user.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Joined {user.joinDate}</span>
              </div>

              {/* Role-specific details */}
              <div className="border-t pt-4 mt-4">
                <h3 className="font-medium mb-2 capitalize">{role} Details</h3>
                {role === 'student' && (
                  <>
                    <div className="flex justify-between text-sm py-1">
                      <span className="text-muted-foreground">Field of Study:</span>
                      <span>{roleInfo.field}</span>
                    </div>
                    <div className="flex justify-between text-sm py-1">
                      <span className="text-muted-foreground">Enrollment Date:</span>
                      <span>{roleInfo.enrollmentDate}</span>
                    </div>
                    <div className="flex justify-between text-sm py-1">
                      <span className="text-muted-foreground">Completed Courses:</span>
                      <span>{roleInfo.completedCourses}</span>
                    </div>
                  </>
                )}
                {role === 'admin' && (
                  <>
                    <div className="flex justify-between text-sm py-1">
                      <span className="text-muted-foreground">Department:</span>
                      <span>{roleInfo.department}</span>
                    </div>
                    <div className="flex justify-between text-sm py-1">
                      <span className="text-muted-foreground">Admin Since:</span>
                      <span>{roleInfo.adminSince}</span>
                    </div>
                    <div className="flex justify-between text-sm py-1">
                      <span className="text-muted-foreground">Access Level:</span>
                      <span>{roleInfo.permissionLevel}</span>
                    </div>
                  </>
                )}
                {role === 'mentor' && (
                  <>
                    <div className="flex justify-between text-sm py-1">
                      <span className="text-muted-foreground">Specialization:</span>
                      <span>{roleInfo.specialization}</span>
                    </div>
                    <div className="flex justify-between text-sm py-1">
                      <span className="text-muted-foreground">Mentor Since:</span>
                      <span>{roleInfo.mentorSince}</span>
                    </div>
                    <div className="flex justify-between text-sm py-1">
                      <span className="text-muted-foreground">Students Supported:</span>
                      <span>{roleInfo.studentsSupported}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Edit Form */}
        <Card className="md:col-span-2 card-shadow">
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue={user.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue={user.email} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" defaultValue={user.phone} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" defaultValue={user.address} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" defaultValue={user.website} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="avatar">Profile Picture</Label>
                  <Input id="avatar" type="file" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea id="bio" rows={4} defaultValue={user.bio} />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Social Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="twitter">Twitter</Label>
                    <Input id="twitter" defaultValue={user.socialLinks.twitter} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input id="linkedin" defaultValue={user.socialLinks.linkedin} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="github">GitHub</Label>
                    <Input id="github" defaultValue={user.socialLinks.github} />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
