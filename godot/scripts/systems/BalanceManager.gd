class_name BalanceManager
extends RefCounted

const BALANCE_PATH := "res://data/balance.json"

static var _cache: Dictionary = {}

static func data() -> Dictionary:
	if not _cache.is_empty():
		return _cache
	var file := FileAccess.open(BALANCE_PATH, FileAccess.READ)
	if file == null:
		_cache = {}
		return _cache
	var parsed = JSON.parse_string(file.get_as_text())
	_cache = parsed if typeof(parsed) == TYPE_DICTIONARY else {}
	return _cache

static func value(path: String, fallback):
	var current = data()
	for part in path.split("."):
		if typeof(current) != TYPE_DICTIONARY or not current.has(part):
			return fallback
		current = current[part]
	return current

