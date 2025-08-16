import streamlit as st
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
import matplotlib.pyplot as plt
import seaborn as sns

# Page settings
st.set_page_config(page_title="Customer Segmentation Engine", layout="wide")
st.title("🎯 Customer Segmentation Engine")
st.markdown("Upload your customer data to find hidden customer groups.")

# Upload CSV
uploaded_file = st.file_uploader("📤 Upload CSV file", type="csv")

if uploaded_file:
    # Load data
    df = pd.read_csv(uploaded_file)
    st.subheader("📄 Preview Data")
    st.dataframe(df.head())

    # Auto-select numeric columns
    numeric_cols = df.select_dtypes(include=['int64', 'float64']).columns.tolist()

    if len(numeric_cols) < 2:
        st.error("❌ Not enough numeric columns found for clustering. Please include at least 2 numeric columns.")
    else:
        st.sidebar.header("⚙️ Clustering Settings")
        k = st.sidebar.slider("Number of Clusters (k)", 2, 10, 3)

        # Prepare data
        data = df[numeric_cols]
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(data)

        # K-Means clustering
        kmeans = KMeans(n_clusters=k, random_state=42)
        df['Cluster'] = kmeans.fit_predict(X_scaled)

        st.success("✅ Clustering complete!")

        # Show cluster summary
        st.subheader("📊 Cluster Summary (Averages)")
        st.dataframe(df.groupby('Cluster')[numeric_cols].mean())

        # Visualization: Cluster Counts
        st.subheader("📈 Cluster Distribution")
        fig, ax = plt.subplots()
        sns.countplot(x='Cluster', data=df, palette='Set2')
        st.pyplot(fig)

        # Show full table with clusters
        st.subheader("🔍 Customers with Cluster Labels")
        st.dataframe(df)

        # Download button
        st.download_button(
            label="📥 Download Clustered Data",
            data=df.to_csv(index=False),
            file_name="clustered_customers.csv",
            mime="text/csv"
        )
else:
    st.info("👆 Please upload a customer CSV file to begin.")
