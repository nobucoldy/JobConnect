#!/bin/bash

# Script to fix CSS variable names across all CSS files

echo "Fixing CSS variables in frontend/src..."

# Find all CSS files and fix variables
find frontend/src -name "*.css" -type f | while read file; do
  echo "Processing: $file"

  # Fix spacing variables
  sed -i 's/var(--spacing-1)/var(--space-1)/g' "$file"
  sed -i 's/var(--spacing-2)/var(--space-2)/g' "$file"
  sed -i 's/var(--spacing-3)/var(--space-3)/g' "$file"
  sed -i 's/var(--spacing-4)/var(--space-4)/g' "$file"
  sed -i 's/var(--spacing-5)/var(--space-5)/g' "$file"
  sed -i 's/var(--spacing-6)/var(--space-6)/g' "$file"
  sed -i 's/var(--spacing-8)/var(--space-8)/g' "$file"
  sed -i 's/var(--spacing-10)/var(--space-10)/g' "$file"
  sed -i 's/var(--spacing-12)/var(--space-12)/g' "$file"

  # Fix neutral color variables
  sed -i 's/var(--neutral-50)/var(--gray-50)/g' "$file"
  sed -i 's/var(--neutral-100)/var(--gray-100)/g' "$file"
  sed -i 's/var(--neutral-200)/var(--gray-200)/g' "$file"
  sed -i 's/var(--neutral-300)/var(--gray-300)/g' "$file"
  sed -i 's/var(--neutral-400)/var(--gray-400)/g' "$file"
  sed -i 's/var(--neutral-500)/var(--gray-500)/g' "$file"
  sed -i 's/var(--neutral-600)/var(--gray-600)/g' "$file"
  sed -i 's/var(--neutral-700)/var(--gray-700)/g' "$file"
  sed -i 's/var(--neutral-800)/var(--gray-800)/g' "$file"
  sed -i 's/var(--neutral-900)/var(--gray-900)/g' "$file"

  # Fix other common variable names
  sed -i 's/var(--primary-dark)/var(--primary-blue-dark)/g' "$file"
  sed -i 's/var(--success-green)/var(--success)/g' "$file"
  sed -i 's/var(--error-red)/var(--danger)/g' "$file"
  sed -i 's/var(--warning-yellow)/var(--warning)/g' "$file"
  sed -i 's/var(--info-blue)/var(--info)/g' "$file"

done

echo "Done! All CSS variables have been fixed."
