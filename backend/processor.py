import re
import tempfile
from pyspark.sql import SparkSession
from pyspark.sql.functions import col, udf, length
from pyspark.sql.types import StringType, StructType, StructField, ArrayType

STOPWORDS = {
    "the", "and", "a", "of", "to", "is", "in", "that", "it", "this", "for",
    "on", "with", "as", "at", "by", "an", "i", "about", "from", "than", "sure",
    "just", "like", "more", "have", "not", "they", "their", "what", "when",
    "which", "who", "will", "would", "been", "were", "also", "into", "over",
    "after", "then", "some", "than", "other", "your", "there", "these", "those",
    "them", "each", "much", "very", "well", "even", "here", "only", "such",
    "both", "many", "most", "does", "said", "being", "because", "while",
    "where", "could", "should", "through", "before", "between", "same", "back",
    "still", "want", "know", "think", "make", "need", "going", "come", "good",
    "dont", "cant", "didnt", "isnt", "wasnt", "hasnt", "hadnt", "wont",
    "people", "time", "year", "years", "way", "really", "thing", "things",
    "look", "made", "used", "using", "says", "since", "every", "https",
    "fifth", "third", "first", "second", "pretty", "actually", "always",
}

def clean_text_pure(text):
    if text is None or not isinstance(text, str):
        return ""
    text = re.sub(r'https?://\S+', '', text)
    text = re.sub(r'[^a-zA-Z0-9\s\.,!\?]', '', text)
    return " ".join(text.split()).lower()

def extract_keywords_pure(text):
    if text is None or not isinstance(text, str):
        return []
    words = re.findall(r'\b[a-z]{4,}\b', text)
    seen = set()
    result = []
    for w in words:
        if w not in STOPWORDS and w not in seen:
            seen.add(w)
            result.append(w)
        if len(result) == 8:
            break
    return result

clean_text_udf = udf(clean_text_pure, StringType())
extract_keywords_udf = udf(extract_keywords_pure, ArrayType(StringType()))

_spark_session = None


def get_spark_session():
    """
    Initializes an optimized Spark Session with a safe memory footprint 
    to successfully pass JVM validation checks on Hugging Face Spaces.
    """
    return SparkSession.builder \
        .appName("PerceptionAIProcessor") \
        .master("local[1]") \
        .config("spark.driver.memory", "1g") \
        .config("spark.executor.memory", "1g") \
        .config("spark.driver.extraJavaOptions", "-XX:+UseSerialGC") \
        .config("spark.executor.extraJavaOptions", "-XX:+UseSerialGC") \
        .config("spark.sql.shuffle.partitions", "2") \
        .config("spark.ui.enabled", "false") \
        .getOrCreate()

def preprocess_posts_with_spark(raw_posts):
    if not raw_posts:
        return []

    spark = get_spark_session()

    schema = StructType([
        StructField("id", StringType(), False),
        StructField("text", StringType(), True),
        StructField("created_utc", StringType(), True)
    ])

    df = spark.createDataFrame(raw_posts, schema)
    df_sanitized = df.na.drop(subset=["text"])

    df_cleaned = df_sanitized.dropDuplicates(["id"]) \
                   .withColumn("cleaned_text", clean_text_udf(col("text"))) \
                   .filter(length(col("cleaned_text")) >= 40)

    df_final = df_cleaned.withColumn("keywords", extract_keywords_udf(col("cleaned_text")))
    return df_final.collect()