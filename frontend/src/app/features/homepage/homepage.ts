import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ProgressService, Progress } from "../../core/services/progress.service";

@Component({
  selector: "app-homepage",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="homepage-container">
      <div class="header">
        <h1>Progress Dashboard</h1>
        <p>Track your progress and achievements</p>
      </div>

      <div class="content" *ngIf="!isLoading; else loading">
        <div class="content" *ngIf="!isLoading; else loading">
          <div class="progress-grid" *ngIf="progressItems.length > 0; else noProgress">
            <div class="progress-card" *ngFor="let item of progressItems.slice().reverse()">
              <div class="card-header">
                <h3>{{ item.title }}</h3>
                <span class="date">{{ item.createdAt | date : "mediumDate" }}</span>
                <span class="tag"> {{ item.images.length }} image{{ item.images.length !== 1 ? "s" : "" }} </span>
              </div>

              <div class="card-content">
                <div class="desc">
                  <p class="description">
                    {{ item.description }}
                  </p>
                </div>

                <div class="images-container" *ngIf="item.images.length > 0">
                  <div class="image-grid">
                    <img
                      *ngFor="let image of item.images"
                      [src]="progressService.getImageUrl(image)"
                      [alt]="item.title"
                      class="progress-image"
                      (click)="openImage(progressService.getImageUrl(image))" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ng-template #noProgress>
          <div class="no-progress">
            <div class="no-progress-icon">📋</div>
            <h3>No Progress Items Yet</h3>
            <p>Start tracking your progress by adding new items.</p>
          </div>
        </ng-template>
      </div>

      <ng-template #loading>
        <div class="loading-container">
          <div class="spinner"></div>
          <p>Loading progress items...</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [
    `
      .homepage-container {
        max-width: 1200px;
        margin-inline: auto;
        padding: 20px;
        min-height: calc(100vh - 500px);
        margin-top: 70px;
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
        color: rgba(243, 244, 246, 0.8);
      }

      .progress-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 20px;
      }

      .progress-card {
        display: flex;
        background: var(--panel-2);
        border: 1px solid var(--border);
        border-radius: 15px;
        box-shadow: 0 6px 18px rgba(0, 0, 0, 0.35);
        overflow: hidden;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        height: 200px;
        color: var(--text);
      }

      .progress-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      }

      .card-header {
        background: transparent;
        padding: 16px;
        border-right: 1px solid var(--border);
        min-width: 300px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
      }

      .card-header h3 {
        margin: 0 0 10px 0;
        color: var(--text);
        font-size: 1.25rem;
      }

      .date {
        color: var(--muted);
        font-size: 0.9rem;
        margin: 0 0 20px 0;
      }

      .card-content {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;
        gap: 20px;
      }

      .description {
        color: rgba(243, 244, 246, 0.85);
        line-height: 1.6;
        margin: 0 0 16px 0;
      }

      .desc {
        flex: 1;
      }
      .images-container {
        margin: 16px 0;
      }

      .image-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
        gap: 8px;
      }

      .progress-image {
        width: 100%;
        height: 160px;
        object-fit: cover;
        border-radius: 15px;
        cursor: pointer;
        transition: transform 0.2s ease;
        border: 1px solid var(--border);
      }

      .progress-image:hover {
        transform: scale(1.05);
      }

      .tags {
        margin-top: 16px;
      }

      .tag {
        display: inline-block;
        padding: 4px 12px;
        background: rgba(245, 158, 11, 0.08);
        color: var(--text);
        border-radius: 16px;
        font-size: 0.875rem;
        border: 1px solid rgba(245, 158, 11, 0.35);
      }

      @media (max-width: 991px) {
        .header h1 {
          font-size: 2rem;
          margin-bottom: 5px;
        }
        .header p {
          font-size: 1rem;
        }
        .card-header {
          padding: 12px;
          min-width: 200px;
        }
        .card-header h3 {
          margin: 0 0 8px 0;
          font-size: 0.8rem;
        }
        .date {
          font-size: 0.7rem;
          margin: 0 0 15px 0;
        }
        .tag {
          font-size: 0.7rem;
        }
        .description {
          line-height: 1.2;
          font-size: 0.95rem;
        }
      }

      @media (max-width: 767px) {
        .progress-card {
          display: grid;
          height: 100%;
        }
        .card-content {
          width: fit-content;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 0 20px;
          gap: 0px;
          margin: 0 auto;
        }
        .description {
          text-align: center;
          padding-top: 15px;
          margin: 0 0 10px 0;
        }
      }

      .no-progress {
        text-align: center;
        padding: 60px 20px;
        color: #666;
      }

      .no-progress-icon {
        font-size: 4rem;
        margin-bottom: 20px;
      }

      .loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 60px 20px;
        color: #666;
      }

      .spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #0e1422;
        border-top: 4px solid var(--brand);
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

      .loading-container p {
        margin: 0;
      }

      @media (max-width: 768px) {
        .progress-grid {
          grid-template-columns: 1fr;
        }

        .header h1 {
          font-size: 2rem;
        }
      }
    `
  ]
})
export class Homepage implements OnInit {
  progressItems: Progress[] = [];
  isLoading = true;

  constructor(public progressService: ProgressService) {}

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

  openImage(imageUrl: string): void {
    window.open(imageUrl, "_blank");
  }
}
