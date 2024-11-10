import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  newUser = {
    first_name: '',
    last_name: '',
    email: '',
    password: ''
  };
   // Form data for creating a new user
  editingUser: any = null; // Track the user being edited

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getUsers();
  }

  // Fetch all users
  getUsers(): void {
    this.userService.getUsers().subscribe(
      (data) => {
        this.users = data;
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  // Create a new user
  createUser(): void {
    this.userService.createUser(this.newUser).subscribe(
      (response) => {
        console.log('User created:', response);
        this.getUsers(); // Refresh the user list after creation
        this.newUser = {
          first_name: '',
          last_name: '',
          email: '',
          password: ''
        };
         // Reset form
      },
      (error) => {
        console.error('Error creating user:', error);
        alert('Error creating user: ' + error.message); // Display error message
      }
    );
  }

  // Update an existing user
  updateUser(id: string): void {
    this.userService.updateUser(id, this.editingUser).subscribe(
      (response) => {
        console.log('User updated:', response);
        this.getUsers(); // Refresh the user list after update
        this.editingUser = null; // Clear editing state
      },
      (error) => {
        console.error('Error updating user:', error);
        alert('Error updating user: ' + error.message); // Display error message
      }
    );
  }

  // Start editing a user
  editUser(user: any): void {
    this.editingUser = { ...user }; // Copy user data to editingUser
  }

  // Delete a user
  deleteUser(id: string): void {
    this.userService.deleteUser(id).subscribe(
      (response) => {
        console.log('User deleted', response);
        this.loadUsers();  // Refresh the list of users
      },
      (error) => { console.error('Error deleting user', error); }
    );
  }
  loadUsers(): void {
    this.userService.getUsers().subscribe(
      (data) => { this.users = data; },
      (error) => { console.error('Error loading users', error); }
    );
  }
}