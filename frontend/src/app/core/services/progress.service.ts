import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Progress {
  _id: string;
  title: string;
  description: string;
  images: string[];
  createdAt: string;
}

export interface CreateProgressRequest {
  title: string;
  description: string;
  images?: File[];
}

export interface UpdateProgressRequest {
  title: string;
  description: string;
  images?: File[];
}

@Injectable({
  providedIn: 'root'
})
export class ProgressService {
  private readonly API_URL = 'http://127.0.0.1:5000'; // Updated to match backend port

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getAllProgress(): Observable<Progress[]> {
    return this.http.get<Progress[]>(`${this.API_URL}/progress`, {
      headers: this.getHeaders()
    });
  }

  addProgress(data: CreateProgressRequest): Observable<Progress> {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    
    if (data.images) {
      data.images.forEach(image => {
        formData.append('images', image);
      });
    }

    return this.http.post<Progress>(`${this.API_URL}/progress/add`, formData, {
      headers: this.getHeaders()
    });
  }

  updateProgress(id: string, data: UpdateProgressRequest): Observable<Progress> {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    
    if (data.images) {
      data.images.forEach(image => {
        formData.append('images', image);
      });
    }

    return this.http.put<Progress>(`${this.API_URL}/progress/update/${id}`, formData, {
      headers: this.getHeaders()
    });
  }

  deleteProgress(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.API_URL}/progress/delete/${id}`, {
      headers: this.getHeaders()
    });
  }

  getImageUrl(filename: string): string {
    return `${this.API_URL}/uploads/${filename}`;
  }
}
