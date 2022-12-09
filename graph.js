class BipartiteGraph{
  constructor(m, n){
    this.m = m;
    this.n = n;
    this.adj = Array(m+1).fill().map(() => []);
  }

  /**Hopcroft-Karp algorithm
   * Finds a maximum cardinality matching in a bipartite graph. WAY faster than the Hungarian algorithm.
  */
  hopcroftKarp(){
    // found distance from vertex (u in U) to NIL vertex
    this.dist = Array(this.m+1).fill();

    // pair of vertex (u in U)
    this.pairU = Array(this.m+1).fill(NIL);

    // pair of vertex (v in V)
    this.pairV = Array(this.n+1).fill(NIL);

    // while there are more matches, find them and add them to the set
    while(this.bfs()){
      for(let u = this.pairU.length; --u;){
        if(this.pairU[u] === NIL) this.dfs(u);
      }
    }
  }

  /**Breadth-first search
   * Checks a matching for new alternating path.
  */
  bfs(){
    // Queue of destination vertices
    var Q = [];

    for(let u = this.pairU.length; --u;){
      if(this.pairU[u] === NIL){
        this.dist[u] = 0;
        Q.push(u);
      } else {
        this.dist[u] = INF;
      }
    }

    this.dist[NIL] = INF;

    // search the Queue for a longer match
    while(Q.length){
      let u = Q.shift();
      if(this.dist[u] < this.dist[NIL]){
        for(let i = this.adj[u].length, v; i--;){
          v = this.adj[u][i];
          if(this.dist[this.pairV[v]] === INF){
            this.dist[this.pairV[v]] = this.dist[u] + 1;
            Q.push(this.pairV[v]);
          }
        }
      }
    }
    return this.dist[NIL] !== INF;
  }

  /**First depth-first search method
   * used to set alternating paths starting from (u in U) into the matching.
  */
  dfs(u){
    if(u !== NIL){
      for(let i = this.adj[u].length, v; i--;){
        v = this.adj[u][i];
        if(this.dist[this.pairV[v]] === this.dist[u]+1 && this.dfs(this.pairV[v])){
          this.pairV[v] = u;
          this.pairU[u] = v;
          return true;
        }
      }
      this.dist[u] = INF;
      return false;
    }
    return true;
  }

  /**Second depth-first search method
   * Marks visited alternating paths through the matching, starting from vertice (u in U)
  */
  dfs2 (u) {
    console.log(u);
    this.visU[u] = true;
    for(let j = this.adj[u].length, v; j--;){
      v = this.adj[u][j];

      // skip if it's already matched/visited
      if(this.pairU[u] === v || this.visV[v]){
        continue;
      }

      // visit v
      this.visV[v] = true;

      // if v is matched and the match is unvisited, recurse from that match.
      if(this.pairV[v] && !this.visU[this.pairV[v]]){
        this.dfs2(this.pairV[v]);
      }
    }
  }

  /**Maximum independent set
   * Finds the maximum independent set in a bipartite graph.
   * Uses the Hopcroft-Karp algorithm to find a maximum cardinality matching.
   * Reduces the matching to the minimum vertex cover by proving Kőnig's theorem.
   * Outputs the inverse of the minimum vertex cover. (The maximum independent set)
  */
  maxIS () {
    this.hopcroftKarp();
    this.visU = Array(this.m+1).fill(false);
    this.visV = Array(this.n+1).fill(false);
    for(let u = this.pairU.length; --u;){

      // only start on unmatched vertices
      if(this.pairU[u]){
        continue;
      }
      this.dfs2(u);
    }
    return {
      m: this.visU,
      n: this.visV.map((v) => !v),
    };
  }

  /**Adds an edge between vertices u and v*/
  addEdge(u, v){
    this.adj[u].push(v);
  }
}
