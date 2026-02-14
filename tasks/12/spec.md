# Task #12: Attention Head Screening for Protein-DNA Interactions

**Repository:** rosalind
**Status:** TODO
**Created:** 2026-02-13T01:00:00Z
**Student:** Rio

## Context

This is the first scientific workflow for Rosalind. Rather than single-pass analysis (like structure prediction), we're building a multi-step agent workflow that screens across multiple biological systems to find the most promising one for studying protein-DNA interactions.

### Why This Task

- **Leverages agent capabilities**: Multi-step exploration, decision-making, ranking
- **Discovery-oriented**: Identifies which system to study, not just benchmarking methods
- **Tests core hypothesis**: Can attention heads from genomic LMs reveal protein-DNA binding patterns?
- **Real data**: Uses Gwanggyu's IS element (transposase) data from cluster

## Biological Background

**Insertion Sequences (IS elements):**
- Mobile genetic elements found in bacterial genomes
- Contain transposase gene(s) flanked by terminal inverted repeats (TIRs)
- Transposase protein binds to TIRs to catalyze transposition
- Clear protein-DNA interaction: transposase recognition of TIR sequences

**Dataset Location:**
- Cluster: `chimera-login:/large_storage/hsulab/ggsun/evo_intergenic_mining/domain_search/genomic_contexts/`
- Multiple IS families: IS3_tnp, IS21_tnp, IS240_tnp, IS30_tnp, IS481_tnp, IS4_tnp, IS5_tnp, IS66_tnp, Mu_tnp, tnp1_resolvase
- Each directory contains:
  - `glm_strings.fasta` - sequences formatted for genomic LMs
  - `system_seqs.fasta` - full sequences
  - `left_flanks.fasta` / `right_flanks.fasta` - flanking regions

**Sequence Format:**
- `<+>` delimited sections: upstream flank, ORF1, middle region, ORF2, downstream flank
- ORFs encode transposase domains
- Flanks contain TIRs and regulatory elements

## Task Objective

**Build an agent workflow that:**
1. Processes multiple IS element clusters (IS3_tnp, IS21_tnp, etc.)
2. For each cluster, extracts attention patterns from genomic language model (Evo or gLM2)
3. Scores protein→DNA attention strength (ORF regions attending to flanking regions)
4. Ranks clusters by signal quality
5. Outputs: "Cluster X shows strongest protein-DNA attention patterns, here's why"

**Success Criteria:**
- Agent can process multiple clusters autonomously
- Agent identifies which attention heads/layers show protein-DNA patterns
- Agent ranks clusters by signal strength with rationale
- Output is actionable (tells researcher which system to focus on)

## Implementation Approach

### Architecture

**Rosalind tools to implement:**

1. **`load_sequences(cluster_name, n_sequences)`**
   - Load sequences from IS element cluster
   - Parse `<+>` delimited format to identify ORF vs flank regions
   - Return structured data: sequence ID, ORF positions, flank positions

2. **`run_genomic_lm(sequence, model="evo")`**
   - Run sequence through Evo (or gLM2)
   - Extract attention maps (all heads, all layers)
   - Return attention tensors

3. **`extract_protein_dna_attention(sequence_data, attention_maps)`**
   - Compute attention weights from ORF tokens → flank tokens
   - Identify which heads show strongest cross-boundary attention
   - Return attention scores per head/layer

4. **`visualize_attention(sequence_data, attention_maps, heads_to_plot)`**
   - Generate attention heatmap
   - Highlight ORF→flank attention patterns
   - Save visualization

5. **`compare_to_baseline(sequences, attention_results)`**
   - Run MSA + conservation analysis (optional baseline)
   - Compare: do attention patterns correlate with conservation?
   - Or reveal additional structure?

### Agent Workflow

```python
# Agent receives task: "Screen IS element clusters for protein-DNA interactions"

for cluster in ["IS3_tnp", "IS21_tnp", "IS240_tnp", ...]:
    # Load sample sequences from cluster
    sequences = load_sequences(cluster, n_sequences=20)

    cluster_scores = []
    for seq in sequences:
        # Run through genomic LM
        attention = run_genomic_lm(seq, model="evo")

        # Extract protein→DNA attention
        protein_dna_scores = extract_protein_dna_attention(seq, attention)
        cluster_scores.append(protein_dna_scores)

    # Aggregate: which heads consistently show protein→DNA attention?
    consistent_heads = identify_consistent_patterns(cluster_scores)

    # Score this cluster
    cluster_signal_strength = compute_signal_strength(consistent_heads)

    # Document findings
    log_cluster_analysis(cluster, cluster_signal_strength, consistent_heads)

# Rank all clusters
ranked_clusters = rank_by_signal_strength(all_cluster_results)

# Generate report
generate_report(ranked_clusters, rationale=True, visualizations=True)
```

### What "Strong Signal" Means

A cluster shows strong protein-DNA interaction signal if:
1. **Consistency**: Multiple sequences in cluster show same attention pattern
2. **Specificity**: Attention focused on specific positions (TIRs, binding sites), not diffuse
3. **Cross-boundary**: Strong attention from ORF tokens to flank tokens
4. **Biological plausibility**: Patterns align with known biology (e.g., attention to inverted repeats)

### Technical Considerations

**Model Choice:**
- Start with Evo (if accessible) or gLM2
- Need model that processes DNA sequences and outputs attention maps
- Context length: sequences are ~1-2kb, well within model capacity

**Attention Extraction:**
- Extract attention matrices from transformer layers
- Shape: [num_layers, num_heads, seq_len, seq_len]
- Focus on cross-boundary attention: ORF indices → flank indices

**Computational:**
- ~10 clusters × 20 sequences × forward pass
- Can parallelize across sequences
- Store attention maps for later analysis (large tensors)

**Baseline Comparison (optional for v1):**
- Run MAFFT or MUSCLE for MSA
- Compute conservation scores
- Compare: do attention patterns match high conservation regions?

## Implementation Steps

### Phase 1: Tool Implementation
1. Implement `load_sequences()` - parse IS element data format
2. Implement `run_genomic_lm()` - integrate Evo/gLM2 with attention extraction
3. Implement `extract_protein_dna_attention()` - compute cross-boundary attention scores
4. Implement `visualize_attention()` - generate interpretable heatmaps
5. Test each tool individually

### Phase 2: Agent Workflow
1. Create agent prompt template for screening task
2. Implement cluster processing loop
3. Implement scoring/ranking logic
4. Implement report generation

### Phase 3: Validation
1. Run workflow on subset of clusters (2-3 to start)
2. Manually inspect top-ranked cluster: do patterns make biological sense?
3. Compare to known biology (literature on IS element TIRs)
4. Iterate on scoring criteria if needed

### Phase 4: Full Run
1. Process all IS element clusters
2. Generate comprehensive ranking
3. Document findings and rationale
4. Identify winner for downstream validation

## Expected Outcomes

**Deliverables:**
1. Ranked list of IS element clusters by protein-DNA attention signal
2. Visualization of attention patterns for top clusters
3. Report explaining why winning cluster is most promising
4. Recommendations for experimental validation

**Scientific Value:**
- Identifies best system for studying transposase-DNA interactions
- Tests hypothesis: can attention heads reveal binding patterns?
- Demonstrates agent capabilities for biological discovery
- Provides actionable guidance for wet lab validation

**Technical Value:**
- Establishes pattern for Rosalind workflows (multi-step, decision-making)
- Validates tool system (decorator-based, composable)
- Demonstrates agent reasoning over biological data

## Future Extensions

Once this workflow succeeds:
1. **Add SAE layer**: Use sparse autoencoders to interpret which features drive attention patterns
2. **Expand to other systems**: Screen other protein-DNA interactions (CRISPR, transcription factors)
3. **Experimental validation**: Mutate predicted binding sites, test binding affinity
4. **Generalize**: Build screening framework for any multi-system comparison

## References

**Data Source:**
- Gwanggyu's intergenic mining project: `/large_storage/hsulab/ggsun/evo_intergenic_mining/`
- IS element families from bacterial genomes

**Relevant Biology:**
- Insertion sequences: mobile genetic elements with transposase + TIRs
- Terminal inverted repeats: recognition sequences for transposase binding
- Transposition mechanism: transposase binds TIRs, excises element, inserts elsewhere

**Related Work:**
- Attention patterns in genomic language models (Arc + Goodfire on Evo 2)
- Protein-DNA binding prediction from sequence
- Co-evolutionary analysis of protein-DNA interfaces

## Notes

- This is Rio's project - aligns with his new focus on Rosalind and bio-AI
- Workflow emerged from conversation about what tasks leverage agent capabilities
- Key insight: screening > benchmarking for actionable scientific output
- First step toward full vision: agents reasoning over interpretable bio world models
