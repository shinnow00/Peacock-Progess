import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { ProgressService, Progress } from "../../core/services/progress.service";

@Component({
  selector: "app-admin",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="admin-container">
      <div class="header">
        <h1>Admin Dashboard</h1>
        <p>Manage progress items and content</p>
      </div>

      <div class="admin-content">
        <!-- Add New Progress Form -->
        <div class="form-card">
          <div class="card-header">
            <h2>Add New Progress</h2>
          </div>

          <div class="card-content">
            <form [formGroup]="progressForm" (ngSubmit)="onSubmit()">
              <div class="form-field">
                <label for="title">Title</label>
                <input id="title" type="text" formControlName="title" placeholder="Enter progress title" class="form-input" />
                <div class="error" *ngIf="progressForm.get('title')?.hasError('required') && progressForm.get('title')?.touched">Title is required</div>
              </div>

              <div class="form-field">
                <label for="description">Description</label>
                <textarea id="description" formControlName="description" rows="4" placeholder="Enter progress description" class="form-textarea"></textarea>
                <div class="error" *ngIf="progressForm.get('description')?.hasError('required') && progressForm.get('description')?.touched">Description is required</div>
              </div>

              <div class="file-upload">
                <label for="imageInput" class="file-upload-label"> 📁 Choose Images </label>
                <input id="imageInput" type="file" multiple accept="image/*" (change)="onFileSelected($event)" style="display: none;" />

                <div class="selected-files" *ngIf="selectedFiles.length > 0">
                  <p>Selected files:</p>
                  <div class="file-list">
                    <span class="file-chip" *ngFor="let file of selectedFiles">
                      {{ file.name }}
                      <button type="button" class="remove-btn" (click)="removeFile(file)">×</button>
                    </span>
                  </div>
                </div>
              </div>

              <div class="form-actions">
                <button type="submit" class="submit-btn" [disabled]="progressForm.invalid || isSubmitting">
                  {{ isSubmitting ? "Adding..." : "Add Progress" }}
                </button>

                <button type="button" class="reset-btn" (click)="resetForm()" [disabled]="isSubmitting">Reset</button>
              </div>
            </form>
          </div>
        </div>

        <!-- Existing Progress Items -->
        <div class="list-card">
          <div class="card-header">
            <h2>Existing Progress Items</h2>
          </div>

          <div class="card-content">
            <div class="progress-list" *ngIf="!isLoading; else loading">
              <div class="progress-item" *ngFor="let item of progressItems.slice().reverse()">
                <div class="item-content">
                  <h3>{{ item.title }}</h3>
                  <p>{{ item.description }}</p>
                  <p class="date">{{ item.createdAt | date : "mediumDate" }}</p>

                  <div class="images-preview" *ngIf="item.images.length > 0">
                    <img *ngFor="let image of item.images.slice(0, 3)" [src]="progressService.getImageUrl(image)" [alt]="item.title" class="preview-image" />
                    <span *ngIf="item.images.length > 3" class="more-images"> +{{ item.images.length - 3 }} more </span>
                  </div>
                </div>

                <div class="item-actions">
                  <button class="action-btn edit-btn" (click)="editItem(item)">✏️</button>
                  <button class="action-btn delete-btn" (click)="deleteItem(item._id)">🗑️</button>
                </div>
              </div>

              <div class="no-items" *ngIf="progressItems.length === 0">
                <p>No progress items yet. Add your first one above!</p>
              </div>
            </div>

            <ng-template #loading>
              <div class="loading">
                <div class="spinner"></div>
                <p>Loading...</p>
              </div>
            </ng-template>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .admin-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
        margin-top: 70px;
        min-height: calc(100vh - 500px);
      }

      .header {
        text-align: center;
        margin-bottom: 40px;
      }

      .header h1 {
        font-size: 2.5rem;
        color: var(--text);
        margin-bottom: 10px;
      }

      .header p {
        font-size: 1.2rem;
        color: var(--muted);
      }

      .admin-content {
        display: grid;
        gap: 30px;
      }

      .form-card,
      .list-card {
        background: var(--panel-2);
        border: 1px solid var(--border);
        border-radius: 8px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        overflow: hidden;
        color: var(--text);
      }

      .card-header {
        background: transparent;
        padding: 20px;
        border-bottom: 1px solid var(--border);
      }

      .card-header h2 {
        margin: 0;
        color: var(--text);
        font-size: 1.5rem;
      }

      .card-content {
        padding: 20px;
      }

      .form-field {
        margin-bottom: 20px;
      }

      .form-field label {
        display: block;
        margin-bottom: 8px;
        font-weight: 500;
        color: var(--text);
      }

      .form-input,
      .form-textarea {
        width: 100%;
        padding: 12px;
        border: 1px solid var(--border);
        border-radius: 6px;
        font-size: 16px;
        transition: border-color 0.2s ease, box-shadow 0.2s ease;
        box-sizing: border-box;
        background: #0d1117;
        color: var(--text);
      }

      .form-textarea {
        resize: vertical;
        min-height: 100px;
      }

      .form-input:focus,
      .form-textarea:focus {
        outline: none;
        border-color: #3f51b5;
      }

      .error {
        color: #f44336;
        font-size: 14px;
        margin-top: 4px;
      }

      .file-upload {
        margin: 20px 0;
      }

      .file-upload-label {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 12px 24px;
        background-color: #0d1117;
        border: 2px dashed var(--border);
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s ease;
        color: var(--text);
      }

      .file-upload-label:hover {
        background-color: rgba(56, 139, 253, 0.1);
        border-color: var(--border);
      }

      .selected-files {
        margin-top: 16px;
      }

      .file-list {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 8px;
      }

      .file-chip {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        background: #e3f2fd;
        color: #1976d2;
        border-radius: 16px;
        font-size: 0.875rem;
        border: 1px solid #bbdefb;
      }

      .remove-btn {
        background: none;
        border: none;
        color: #1976d2;
        cursor: pointer;
        font-size: 18px;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .form-actions {
        display: flex;
        gap: 16px;
        margin-top: 24px;
      }

      .submit-btn,
      .reset-btn {
        padding: 12px 24px;
        border: none;
        border-radius: 4px;
        font-size: 16px;
        cursor: pointer;
        transition: background-color 0.2s ease;
      }

      .submit-btn {
        background: #3f51b5;
        color: white;
      }

      .submit-btn:hover:not(:disabled) {
        background: #303f9f;
      }

      .submit-btn:disabled {
        background: #ccc;
        cursor: not-allowed;
      }

      .reset-btn {
        background: #f5f5f5;
        color: #333;
        border: 1px solid #ddd;
      }

      .reset-btn:hover:not(:disabled) {
        background: #e0e0e0;
      }

      .progress-list {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .progress-item {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        padding: 16px;
        border: 1px solid var(--border);
        border-radius: 10px;
        background: var(--panel-2);
        color: var(--text);
      }

      .item-content h3 {
        margin: 0 0 8px 0;
        color: var(--text);
      }

      .item-content p {
        margin: 0 0 8px 0;
        color: rgba(201, 209, 217, 0.85);
      }

      .date {
        font-size: 0.9rem;
        color: var(--muted);
      }

      .images-preview {
        display: flex;
        gap: 8px;
        margin-top: 12px;
      }

      .preview-image {
        width: 60px;
        height: 60px;
        object-fit: cover;
        border-radius: 6px;
        border: 1px solid var(--border);
      }

      .more-images {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 60px;
        height: 60px;
        background-color: #f0f0f0;
        border-radius: 4px;
        color: #666;
        font-size: 0.9rem;
      }

      .item-actions {
        display: flex;
        gap: 8px;
      }

      .action-btn {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 18px;
        padding: 8px;
        border-radius: 4px;
        transition: background-color 0.2s ease;
      }

      .edit-btn:hover {
        background: rgba(56, 139, 253, 0.12);
      }

      .delete-btn:hover {
        background: rgba(248, 81, 73, 0.12);
      }

      .no-items {
        text-align: center;
        padding: 40px;
        color: #666;
      }

      .loading {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 40px;
        color: #666;
      }

      .spinner {
        width: 30px;
        height: 30px;
        border: 3px solid #0d1117;
        border-top: 3px solid var(--brand);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 16px;
      }

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }

      .loading p {
        margin: 0;
      }

      @media (max-width: 768px) {
        .header h1 {
          font-size: 2rem;
        }

        .progress-item {
          flex-direction: column;
          gap: 16px;
        }

        .item-actions {
          align-self: flex-end;
        }
      }
    `
  ]
})
export class Admin implements OnInit {
  progressForm: FormGroup;
  progressItems: Progress[] = [];
  selectedFiles: File[] = [];
  isSubmitting = false;
  isLoading = true;
  isEditing = false;
  editingId: string | null = null;
  existingImages: string[] = [];

  constructor(private fb: FormBuilder, public progressService: ProgressService) {
    this.progressForm = this.fb.group({
      title: ["", Validators.required],
      description: ["", Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadProgressItems();
  }

  loadProgressItems(): void {
    this.isLoading = true;
    this.progressService.getAllProgress().subscribe({
      next: (items) => {
        this.progressItems = items;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        console.error("Error loading progress items:", error);
        alert("Failed to load progress items.");
      }
    });
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const files = Array.from(target.files || []);
    this.selectedFiles = [...this.selectedFiles, ...files];
  }

  removeFile(file: File): void {
    this.selectedFiles = this.selectedFiles.filter((f) => f !== file);
  }

  editItem(item: Progress): void {
    this.isEditing = true;
    this.editingId = item._id;
    this.existingImages = item.images || [];
    this.progressForm.patchValue({
      title: item.title,
      description: item.description
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  onSubmit(): void {
    if (this.progressForm.valid) {
      this.isSubmitting = true;
      const payload = {
        title: this.progressForm.value.title,
        description: this.progressForm.value.description,
        images: this.selectedFiles
      };

      if (this.isEditing && this.editingId) {
        this.progressService.updateProgress(this.editingId, payload).subscribe({
          next: () => {
            this.isSubmitting = false;
            alert("Progress item updated successfully!");
            this.resetForm();
            this.loadProgressItems();
          },
          error: (error) => {
            this.isSubmitting = false;
            console.error("Error updating progress item:", error);
            alert("Failed to update progress item.");
          }
        });
      } else {
        this.progressService.addProgress(payload).subscribe({
          next: () => {
            this.isSubmitting = false;
            alert("Progress item added successfully!");
            this.resetForm();
            this.loadProgressItems();
          },
          error: (error) => {
            this.isSubmitting = false;
            console.error("Error adding progress item:", error);
            alert("Failed to add progress item.");
          }
        });
      }
    }
  }

  resetForm(): void {
    this.progressForm.reset();
    this.selectedFiles = [];
    this.isEditing = false;
    this.editingId = null;
    this.existingImages = [];
  }

  deleteItem(id: string): void {
    if (confirm("Are you sure you want to delete this progress item?")) {
      this.progressService.deleteProgress(id).subscribe({
        next: () => {
          alert("Progress item deleted successfully!");
          this.loadProgressItems();
        },
        error: (error) => {
          console.error("Error deleting progress item:", error);
          alert("Failed to delete progress item.");
        }
      });
    }
  }
}
