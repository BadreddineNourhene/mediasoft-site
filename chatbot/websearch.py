"""Recherche web de secours, quand la base de connaissances ne contient pas la réponse.

La recherche est limitée aux sites officiels (WEB_SEARCH_DOMAINS : Mediasoft, Sage, Divalto, Bitrix24, Microsoft),
pour ne jamais répondre à partir de sources douteuses. Service utilisé : Tavily (https://tavily.com), API de recherche
pensée pour les assistants IA, 1 000 recherches gratuites par mois. Sans TAVILY_API_KEY, la recherche web est désactivée
et le chatbot se comporte comme avant (message de contact).
"""

import logging
import re
import time

import httpx

import config

log = logging.getLogger(__name__)

# question → (instant, résultats) : la même question ne consomme le quota qu'une fois par jour
_cache: dict[str, tuple[float, list[dict]]] = {}
CACHE_SECONDS = 24 * 3600
# Pages de forums et de communautés (réponses d'utilisateurs, pas de l'éditeur) : écartées même sur un site officiel
COMMUNAUTE = re.compile(r"/answers/|/questions/|/forums?/|/community|communityhub\.|techcommunity\.|/blogs?/", re.I)


def enabled():
    return bool(config.TAVILY_API_KEY)


async def search(query: str, max_results: int = 5, officiel: bool = True):
    """Pages pertinentes : [{"title", "url", "content", "officiel"}], ou [] si rien ou en cas d'erreur.
    officiel=True : sites officiels seulement (WEB_SEARCH_DOMAINS) ; False : tout le web (dernier recours)."""
    if not enabled():
        return []
    key = f"{officiel}|{query.strip().lower()}"
    hit = _cache.get(key)
    if hit and time.time() - hit[0] < CACHE_SECONDS:
        return hit[1]
    try:
        async with httpx.AsyncClient(timeout=15) as client:
            r = await client.post(
                "https://api.tavily.com/search",
                headers={"Authorization": f"Bearer {config.TAVILY_API_KEY}"},
                json={
                    "query": query,
                    "search_depth": "basic",
                    "max_results": max_results,
                    "include_answer": False,
                    **({"include_domains": config.WEB_SEARCH_DOMAINS} if officiel else {}),
                },
            )
        r.raise_for_status()
        results = [
            {
                "title": x.get("title") or x.get("url"),
                "url": x["url"],
                "content": (x.get("content") or "")[:1500],
                "officiel": officiel,
            }
            for x in r.json().get("results", [])
            if x.get("url") and x.get("content") and not COMMUNAUTE.search(x["url"])
        ]
    except (httpx.HTTPError, ValueError, KeyError) as e:
        log.warning("Recherche web indisponible : %s", e)
        return []
    if len(_cache) > 500:
        _cache.clear()
    _cache[key] = (time.time(), results)
    return results
