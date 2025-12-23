/**
 * SelfieSegmentationService - Singleton service for managing the MediaPipe SelfieSegmentation model
 * 
 * This service ensures only ONE instance of the WASM-based SelfieSegmentation model exists
 * across the entire application, preventing "Module.arguments has been replaced" and
 * "memory access out of bounds" errors that occur when multiple instances are created.
 */

import { SelfieSegmentation } from "@mediapipe/selfie_segmentation";

class SelfieSegmentationService {
  private static instance: SelfieSegmentationService;
  private model: SelfieSegmentation | null = null;
  private isInitializing: boolean = false;
  private initPromise: Promise<SelfieSegmentation | null> | null = null;
  private isDestroyed: boolean = false;

  private constructor() {}

  public static getInstance(): SelfieSegmentationService {
    if (!SelfieSegmentationService.instance) {
      SelfieSegmentationService.instance = new SelfieSegmentationService();
    }
    return SelfieSegmentationService.instance;
  }

  /**
   * Get or initialize the SelfieSegmentation model.
   * Returns the existing model if already initialized, or initializes a new one.
   * Thread-safe - multiple calls during initialization will wait for the same promise.
   */
  public async getModel(): Promise<SelfieSegmentation | null> {
    // If already destroyed, don't return anything
    if (this.isDestroyed) {
      console.warn("SelfieSegmentationService: Model was destroyed, creating new instance");
      this.isDestroyed = false;
    }

    // Return existing model if available
    if (this.model) {
      return this.model;
    }

    // If already initializing, wait for that promise
    if (this.isInitializing && this.initPromise) {
      return this.initPromise;
    }

    // Start initialization
    this.isInitializing = true;
    this.initPromise = this.initializeModel();
    
    try {
      const result = await this.initPromise;
      return result;
    } finally {
      this.isInitializing = false;
    }
  }

  private async initializeModel(): Promise<SelfieSegmentation | null> {
    try {
      console.log("SelfieSegmentationService: Initializing model...");
      const startTime = Date.now();

      const segmentation = new SelfieSegmentation({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`,
      });

      segmentation.setOptions({
        modelSelection: 1, // 0: General (faster), 1: Landscape (slower, better quality)
        selfieMode: false,
      });

      await segmentation.initialize();
      
      console.log(`SelfieSegmentationService: Model initialized in ${Date.now() - startTime}ms`);
      this.model = segmentation;

      return this.model;
    } catch (error) {
      console.error("SelfieSegmentationService: Failed to initialize model", error);
      this.model = null;
      return null;
    }
  }

  /**
   * Check if the model is currently available (initialized and not destroyed)
   */
  public isModelAvailable(): boolean {
    return this.model !== null && !this.isDestroyed;
  }

  /**
   * Get the model reference directly (may be null)
   * Use this for synchronous checks, but prefer getModel() for actual usage
   */
  public getModelSync(): SelfieSegmentation | null {
    if (this.isDestroyed) return null;
    return this.model;
  }

  /**
   * Destroy the model and release resources.
   * Should only be called when the entire app is shutting down,
   * NOT when individual components unmount.
   */
  public destroy(): void {
    if (this.model) {
      try {
        this.model.close();
      } catch (error) {
        console.warn("SelfieSegmentationService: Error during model close", error);
      }
      this.model = null;
    }
    this.isDestroyed = true;
    this.initPromise = null;
    this.isInitializing = false;
  }

  /**
   * Reset the service state without destroying the model.
   * Use this to clear any pending state after errors.
   */
  public reset(): void {
    this.isInitializing = false;
    this.initPromise = null;
    // Don't destroy the model, just reset the initialization state
  }
}

// Export singleton instance
export const selfieSegmentationService = SelfieSegmentationService.getInstance();

// Export type for external usage
export type { SelfieSegmentation };
