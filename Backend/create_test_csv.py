import pandas as pd

# Create sample data
data = {
    'Product': ['Urea', 'DAP', 'NPK', 'Rice Seeds', 'Wheat Seeds'],
    'Price': [500, 1200, 800, 150, 200],
    'Quantity': [100, 50, 75, 200, 150],
    'Category': ['Fertilizer', 'Fertilizer', 'Fertilizer', 'Seed', 'Seed']
}

df = pd.DataFrame(data)

# Save as CSV (no openpyxl required)
df.to_csv('test_products.csv', index=False)
print("✅ Created test_products.csv")
print(f"📊 File contains {len(df)} products")
print("📋 Columns:", list(df.columns))
print("\n📄 Data preview:")
print(df)