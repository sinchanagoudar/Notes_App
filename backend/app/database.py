from pymongo import MongoClient
from app.config import settings
import sys
import threading
from pymongo.errors import PyMongoError


# Minimal in-memory collection shim (supports the small subset of pymongo used by the app)
class InMemoryCollection:
	def __init__(self):
		self._lock = threading.Lock()
		self._data = []

	def find_one(self, query):
		with self._lock:
			for doc in self._data:
				match = True
				for k, v in query.items():
					if doc.get(k) != v:
						match = False
						break
				if match:
					return doc.copy()
		return None

	def insert_one(self, doc):
		from types import SimpleNamespace
		with self._lock:
			self._data.append(doc.copy())
			return SimpleNamespace(inserted_id=doc.get("_id"))

	def find(self, query=None):
		with self._lock:
			if not query:
				for d in list(self._data):
					yield d.copy()
			else:
				for d in list(self._data):
					match = True
					for k, v in query.items():
						if d.get(k) != v:
							match = False
							break
					if match:
						yield d.copy()

	def update_one(self, filter_q, update_q):
		with self._lock:
			for d in self._data:
				match = True
				for k, v in filter_q.items():
					if d.get(k) != v:
						match = False
						break
				if match:
					if "$set" in update_q:
						for k, v in update_q["$set"].items():
							d[k] = v
					from types import SimpleNamespace
					return SimpleNamespace(modified_count=1)
			from types import SimpleNamespace
			return SimpleNamespace(modified_count=0)

	def delete_one(self, filter_q):
		with self._lock:
			for i, d in enumerate(self._data):
				match = True
				for k, v in filter_q.items():
					if d.get(k) != v:
						match = False
						break
				if match:
					del self._data[i]
					from types import SimpleNamespace
					return SimpleNamespace(deleted_count=1)
			from types import SimpleNamespace
			return SimpleNamespace(deleted_count=0)


# Try to connect to MongoDB; if unavailable, fall back to in-memory collections (development convenience)
use_in_memory = False
database = None
users_collection = None
notes_collection = None
try:
	client = MongoClient(settings.MONGODB_URL, serverSelectionTimeoutMS=5000)
	# force server selection to raise early if unreachable
	client.server_info()
	database = client[settings.DATABASE_NAME]

	users_collection = database.get_collection("users")
	notes_collection = database.get_collection("notes")

	# Create indexes, but don't crash the application if Mongo isn't reachable yet
	try:
		users_collection.create_index("user_email", unique=True)
		notes_collection.create_index("user_id")
	except Exception as e:
		print(f"Warning: could not create indexes on startup: {e}", file=sys.stderr)
except PyMongoError as e:
	print(f"Warning: could not connect to MongoDB at {settings.MONGODB_URL}: {e}", file=sys.stderr)
	print("Falling back to in-memory database. Data will not persist across restarts.", file=sys.stderr)
	use_in_memory = True

	users_collection = InMemoryCollection()
	notes_collection = InMemoryCollection()

	class InMemoryDB:
		def __init__(self, users_col, notes_col):
			self._users = users_col
			self._notes = notes_col

		def get_collection(self, name):
			if name == "users":
				return self._users
			if name == "notes":
				return self._notes
			# unknown collection: return a fresh in-memory collection
			return InMemoryCollection()

	database = InMemoryDB(users_collection, notes_collection)