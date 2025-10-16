import os

# Create all required data directories
categories = [
    "accreditation",
    "framework", 
    "qualifications",
    "recognition",
    "equivalency",
    "apel",
    "faq"
]

print("📁 Creating required data directories...")
for category in categories:
    data_path = f"data/{category}"
    if not os.path.exists(data_path):
        os.makedirs(data_path, exist_ok=True)
        print(f"✅ Created: {data_path}")
    else:
        file_count = len([f for f in os.listdir(data_path) if os.path.isfile(os.path.join(data_path, f))])
        print(f"✓ Already exists: {data_path} ({file_count} files)")

print("\n📋 Directory structure:")
for category in categories:
    data_path = f"data/{category}"
    file_count = len([f for f in os.listdir(data_path) if os.path.isfile(os.path.join(data_path, f))])
    print(f"   📂 {category}/ - {file_count} files")

print("\n🎉 Now add your documents to the appropriate folders!")
print("\n📝 Category descriptions:")
print("   - accreditation: Accreditation process and status documents")
print("   - framework: MQA framework and policy documents")
print("   - qualifications: Qualification standards and guidelines")
print("   - recognition: Recognition of qualifications documents")
print("   - equivalency: Qualification equivalency documents")
print("   - apel: APEL (Accreditation of Prior Experiential Learning) documents")
print("   - faq: Frequently asked questions and general information")